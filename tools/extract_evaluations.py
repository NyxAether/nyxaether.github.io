# /// script
# requires-python = ">=3.11"
# dependencies = ["pypdf"]
# ///
"""Extract trainee satisfaction surveys (PDF) into a CSV and a public testimonials file.

Usage:
    uv run tools/extract_evaluations.py <surveys_dir> [--csv out.csv]
        [--site-data _data/testimonials.json] [--redact WORD ...]

<surveys_dir> contains one sub-folder per session, each holding one PDF per trainee.
PDFs are only read, never modified.

The CSV (full names, all scores) is meant to stay outside the repository. The site data
only keeps trainees who allowed publication and left a comment, signed "Firstname L.".
Comments containing any --redact word (case-insensitive) are left out of the site data.
"""

import argparse
import csv
import json
import re
import sys
import unicodedata
from pathlib import Path

from pypdf import PdfReader

QUESTIONS = {
    "satisfaction": ("Quel est votre degré de satisfaction", "What is your level of satisfaction"),
    "alternance": ("L'alternance théorie/pratique", "The theory/practice alternation"),
    "expertise": ("L'expertise du formateur", "The expertise of the trainer"),
    "ecoute": ("Le formateur est à l'écoute", "The trainer listens"),
    "materiel": ("Le matériel pédagogique", "The teaching material"),
}
COMMENT_LABELS = ("Faîtes-nous part de vos commentaires", "Give us your comments")
CONSENT_LABELS = ("rende publics mes commentaires", "make public my comments")
SELECTED = "Choix sélectionné"
EMPTY_COMMENTS = {"", "-", "aucune réponse", "ras"}

MONTHS = {
    "janvier": 1, "février": 2, "mars": 3, "avril": 4, "mai": 5, "juin": 6,
    "juillet": 7, "août": 8, "septembre": 9, "octobre": 10, "novembre": 11, "décembre": 12,
}
DATE_RE = re.compile(r"^(\d{1,2}) (\w+) (\d{4})$")
SESSION_ID_RE = re.compile(r"^\d+(?:_\d+)+$")

CSV_FIELDS = [
    "fichier", "session", "formation", "stagiaire", "date_reponse",
    *QUESTIONS, "moyenne", "commentaire", "publication_autorisee",
]


class ParseError(Exception):
    pass


def read_lines(pdf: Path) -> list[str]:
    text = "\n".join(page.extract_text() for page in PdfReader(pdf).pages)
    text = unicodedata.normalize("NFC", text).replace("’", "'")
    lines = [line.strip() for line in text.splitlines()]
    lines = [line for line in lines if line]
    # Drop page footers, extracted as "Page", "1", "/", "3", and collapse labels that some
    # exports print twice in a row.
    out, i = [], 0
    while i < len(lines):
        if lines[i] == "Page" and i + 3 < len(lines) and lines[i + 2] == "/":
            i += 4
            continue
        if not out or out[-1] != lines[i]:
            out.append(lines[i])
        i += 1
    return out


def find(lines: list[str], labels: tuple[str, ...], contains: bool = False) -> int:
    for i, line in enumerate(lines):
        if any((label in line) if contains else line.startswith(label) for label in labels):
            return i
    raise ParseError(f"label not found: {labels[0]!r}")


def parse_score(lines: list[str], labels: tuple[str, ...]) -> int:
    start = find(lines, labels)
    legend = next((i for i in range(start + 1, start + 4) if re.match(r"^1 (=|corresp)", lines[i])), None)
    if legend is None:
        raise ParseError(f"scale legend not found: {labels[0]!r}")
    # French layout lists the options 1..5 with the selection marker just before the chosen
    # one; English layout only prints the chosen score.
    options = []
    for line in lines[legend + 1:]:
        if line != SELECTED and not re.fullmatch(r"[1-5]", line):
            break
        options.append(line)
    if SELECTED in options:
        after = options[options.index(SELECTED) + 1:]
        if after and after[0] != SELECTED:
            return int(after[0])
    elif len(options) == 1:
        return int(options[0])
    raise ParseError(f"score not found: {labels[0]!r} ({options})")


def parse_header(lines: list[str]) -> tuple[str, str, str]:
    """Return (training title, response date ISO, trainee "LASTNAME Firstname")."""
    id_idx = next((i for i, line in enumerate(lines[:30]) if SESSION_ID_RE.match(line)), None)
    if id_idx is None:
        raise ParseError("session id not found")
    title = lines[2]
    m = DATE_RE.match(lines[id_idx - 1])
    if not m or m.group(2) not in MONTHS:
        raise ParseError(f"response date not found: {lines[id_idx - 1]!r}")
    date = f"{m.group(3)}-{MONTHS[m.group(2)]:02d}-{int(m.group(1)):02d}"
    # After the session id: trainer, location, trainee.
    trainee = lines[id_idx + 3]
    return title, date, trainee


def split_name(full: str) -> tuple[str, str]:
    """Split a "LASTNAME Firstname" string into (first name, last name)."""
    tokens = full.split()
    if 0 < sum(t.isupper() for t in tokens) < len(tokens):
        last = [t for t in tokens if t.isupper()]
        first = [t for t in tokens if not t.isupper()]
    elif len(tokens) > 1:
        # All upper case or all mixed case: the first name comes last.
        last, first = tokens[:-1], tokens[-1:]
    else:
        last, first = tokens, []
    first_name = "-".join(p.capitalize() for p in " ".join(first).split("-"))
    first_name = " ".join(w[:1].upper() + w[1:] for w in first_name.split())
    return first_name, " ".join(last)


def parse_comment(lines: list[str]) -> str:
    start = find(lines, COMMENT_LABELS)
    end = find(lines, CONSENT_LABELS, contains=True)
    comment = " ".join(lines[start + 1:end]).strip()
    return "" if comment.lower() in EMPTY_COMMENTS else re.sub(r"\s+", " ", comment)


def parse_consent(lines: list[str]) -> bool:
    answer = lines[find(lines, CONSENT_LABELS, contains=True) + 1]
    if answer not in ("Oui", "Non", "Yes", "No"):
        raise ParseError(f"unexpected consent answer: {answer!r}")
    # The question is "I do NOT want my comments made public".
    return answer in ("Non", "No")


def parse_pdf(pdf: Path) -> dict:
    lines = read_lines(pdf)
    title, date, trainee = parse_header(lines)
    scores = {key: parse_score(lines, labels) for key, labels in QUESTIONS.items()}
    return {
        "fichier": pdf.name,
        "session": pdf.parent.name,
        "formation": title,
        "stagiaire": trainee,
        "date_reponse": date,
        **scores,
        "moyenne": round(sum(scores.values()) / len(scores), 2),
        "commentaire": parse_comment(lines),
        "publication_autorisee": parse_consent(lines),
    }


def to_testimonial(row: dict) -> dict:
    first, last = split_name(row["stagiaire"])
    return {
        "author": f"{first} {last[:1]}." if first else f"{last[:1]}.",
        "training": re.sub(r"\s*\(en anglais\)$", "", row["formation"]),
        "date": row["date_reponse"][:7],
        "rating": row["moyenne"],
        "comment": row["commentaire"],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("surveys_dir", type=Path)
    parser.add_argument("--csv", type=Path, help="CSV output (default: <surveys_dir>/evaluations.csv)")
    parser.add_argument("--site-data", type=Path, help="JSON testimonials output for the website")
    parser.add_argument("--redact", nargs="*", default=[], help="drop site comments containing these words")
    args = parser.parse_args()

    rows, errors = [], []
    for pdf in sorted(args.surveys_dir.glob("*/*.pdf")):
        try:
            rows.append(parse_pdf(pdf))
        except ParseError as e:
            errors.append(f"{pdf.parent.name}/{pdf.name}: {e}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1

    rows.sort(key=lambda r: (r["date_reponse"], r["session"], r["fichier"]))
    csv_path = args.csv or args.surveys_dir / "evaluations.csv"
    with csv_path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS, delimiter=";")
        writer.writeheader()
        for row in rows:
            writer.writerow({**row, "moyenne": f"{row['moyenne']:.2f}".replace(".", ",")})
    print(f"{len(rows)} surveys -> {csv_path}")

    if args.site_data:
        redact = [w.lower() for w in args.redact]
        testimonials = [
            to_testimonial(r) for r in rows
            if r["publication_autorisee"] and r["commentaire"]
            and not any(w in r["commentaire"].lower() for w in redact)
        ]
        args.site_data.parent.mkdir(parents=True, exist_ok=True)
        args.site_data.write_text(json.dumps(testimonials, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"{len(testimonials)} testimonials -> {args.site_data}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

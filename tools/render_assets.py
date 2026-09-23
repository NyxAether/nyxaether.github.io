# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "playwright>=1.47",
#     "pillow>=10",
# ]
# ///
"""Regenerate the site's raster assets from their sources.

- assets/images/favicon/favicon-{16,32,180}.png and favicon.ico, from favicon-light.svg
- assets/images/og-image.png (1200x630), from tools/og-image.html

Usage (from the repo root):
    uv run tools/render_assets.py

First run only, install the Chromium used for rendering:
    uv run --with playwright playwright install chromium
"""

from io import BytesIO
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
FAVICON_DIR = ROOT / "assets" / "images" / "favicon"


def render_favicon(page) -> None:
    page.set_viewport_size({"width": 512, "height": 512})
    page.goto((FAVICON_DIR / "favicon-light.svg").as_uri())
    page.wait_for_timeout(300)  # embedded font
    master = Image.open(BytesIO(page.screenshot(omit_background=True))).convert("RGBA")

    for size in (16, 32, 180):
        master.resize((size, size), Image.LANCZOS).save(FAVICON_DIR / f"favicon-{size}.png")
    master.resize((48, 48), Image.LANCZOS).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])


def render_og_image(page) -> None:
    page.set_viewport_size({"width": 1200, "height": 630})
    page.goto((ROOT / "tools" / "og-image.html").as_uri())
    page.wait_for_load_state("networkidle")
    page.evaluate("document.fonts.ready")
    page.screenshot(path=str(ROOT / "assets" / "images" / "og-image.png"))


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        render_favicon(page)
        render_og_image(page)
        browser.close()
    print("favicon + og-image regenerated")


if __name__ == "__main__":
    main()

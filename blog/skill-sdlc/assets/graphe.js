(function () {
  const PHASES = ['ouverture', 'intention', 'conception', 'plan', 'tests', 'code', 'merge'];
  // Chaque temps : arêtes actives (préfixe « < » : le paquet remonte), nœuds allumés, porte, refus, commit.
  const T = [
    { p: 0, e: ['uc'], n: ['user', 'coord'], t: "Tu tapes /chantier nouveau <idée>. Le coordinateur lance ouvrir.py : branche chantier/<slug>, worktree, dossiers partagés, environnement." , br: 1 },
    { p: 0, e: ['<uc'], n: ['user', 'coord'], t: "Une seule question : le brief s'il manque, et la permission de commiter seul sur la branche du chantier." },
    { p: 0, e: ['cj'], n: ['coord', 'journal'], t: "Le coordinateur crée journal.md, qu'il tiendra seul : phase, agents, décisions prises seul, déroulé." },
    { p: 1, e: ['c-int'], n: ['coord', 'int'], t: "Agent neuf chantier-intention, avec le brief mot pour mot. Il ne connaît que les fichiers." },
    { p: 1, e: ['int-doc'], n: ['int', 'd-int'], g: 1, t: "Il écrit intent.md : le quoi et le pourquoi, sans solution. garde.py le laisse écrire ce seul document." },
    { p: 1, e: ['<c-int', '<uc'], n: ['int', 'coord', 'user'], t: "Ses questions sur les trous du brief remontent ; le coordinateur te les pose en une série, puis continue le même agent avec tes réponses." },
    { p: 1, e: ['<uc'], n: ['user', 'd-int'], gate: 1, t: "Porte 1 : tu valides intent.md. Le critère de réussite doit se vérifier par une commande ou une mesure." },
    { p: 1, e: ['cg'], n: ['coord'], c: 1, t: "Commit d'intent.md et du journal sur la branche du chantier." },
    { p: 2, e: ['c-con', 'con-doc'], n: ['coord', 'con', 'd-spec'], g: 1, t: "chantier-conception rédige spec.md à partir d'intent.md, de CLAUDE.md et du code." },
    { p: 2, e: [], n: ['con', 'd-int'], b: 'b-con-int', g: 1, t: "S'il touche intent.md, garde.py refuse : un aval ne modifie jamais l'amont. Il le signale dans amont_a_rouvrir." },
    { p: 2, e: ['c-rel', 'rel-spec'], n: ['coord', 'rel', 'd-spec'], t: "Un premier chantier-relecteur, propre à cette phase, relit spec.md contre intent.md et CLAUDE.md, sans rien écrire." },
    { p: 2, e: ['<c-rel', 'c-con', 'c-rel'], n: ['coord', 'con', 'rel'], t: "Remarque bloquante que l'amont tranche : relance du même agent par SendMessage, puis du même relecteur. Deux relances au plus. Pas de commit : la spec passe la porte avec le plan." },
    { p: 3, e: ['c-pla', 'pla-doc'], n: ['coord', 'pla', 'd-plan'], g: 1, t: "chantier-plan écrit plan.md : étapes, tests nommés, risques, vérification, décisions à reporter." },
    { p: 3, e: ['c-rel', 'rel-plan'], n: ['coord', 'rel', 'd-plan'], t: "Un relecteur neuf, pas celui de la conception, vérifie que chaque critère d'acceptation a son test." },
    { p: 3, e: ['<uc'], n: ['user', 'd-spec', 'd-plan'], gate: 1, t: "Porte 2 : tu valides le dossier de conception, sur un résumé d'une page." },
    { p: 3, e: ['cg'], n: ['coord'], c: 2, t: "Commit de spec.md et plan.md. Désormais, garde.py laisse écrire les tests." },
    { p: 4, e: ['c-tes', 'tes-doc'], n: ['coord', 'tes', 'd-tests'], g: 1, t: "Seul chantier-tests écrit sous tests/ : garde.py le reconnaît par agent_type." },
    { p: 4, e: ['c-rel', 'rel-tests'], n: ['coord', 'rel', 'd-tests'], t: "Un relecteur neuf relit le diff : exactement la liste du plan, aucun test affaibli." },
    { p: 4, e: ['cg'], n: ['coord'], c: 3, t: "Le coordinateur vérifie que les nouveaux tests échouent pour la raison attendue, puis commite les tests." },
    { p: 5, e: ['c-cod', 'cod-doc'], n: ['coord', 'cod', 'd-src'], g: 1, t: "chantier-code écrit sous src/, maintenant que les tests sont commités." },
    { p: 5, e: [], n: ['cod', 'd-tests'], b: 'b-cod-tes', g: 1, t: "S'il touche un test, refus. Un test qui lui semble faux remonte en escalade, jamais affaibli." },
    { p: 5, e: ['cg', '<uc'], n: ['coord', 'user', 'd-int'], c: 4, t: "Suite verte et mesure atteinte : intent.md passe à statut: clos, commit, puis bilan en cinq lignes. Le chantier est prêt à merger." },
    { p: 6, e: ['ucmd', 'cmdetat'], n: ['user', 'cmd', 'etat'], gate: 1, t: "Porte 3 : tu tapes /chantier merge. commande.py pose l'approbation pour cette session ; Claude ne peut pas l'écrire." },
    { p: 6, e: ['cg'], n: ['coord'], c: 5, t: "Le coordinateur fusionne depuis le dossier principal : git merge --no-ff, l'historique des phases est conservé." },
    { p: 6, e: ['cg'], n: ['coord'], c: 6, t: "Décisions de plan.md reportées dans CLAUDE.md, commit à part. Worktree et branche : gardés ou supprimés, à ton choix." }
  ];

  const $ = (id) => document.getElementById(id);
  const svg = document.querySelector('.graphe svg');
  const paquets = $('paquets');
  const lent = matchMedia('(prefers-reduced-motion: reduce)');
  let i = -1, jeu = false, minuteur = null;

  const zone = $('boutons-phases');
  PHASES.forEach((nom, p) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'phase'; b.textContent = p + ' ' + nom; b.dataset.p = p;
    b.addEventListener('click', () => { aller(T.findIndex((t) => t.p === p)); });
    zone.appendChild(b);
  });

  function noeud(id) { return $(id.startsWith('d-') ? id : 'n-' + id); }

  function lancerPaquet(chemin, envers) {
    if (lent.matches) return;
    const L = chemin.getTotalLength();
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', '4.5'); c.setAttribute('class', 'g-pk');
    paquets.appendChild(c);
    const t0 = performance.now(), d = 1100;
    (function pas(t) {
      const k = Math.min(1, (t - t0) / d), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const pt = chemin.getPointAtLength((envers ? 1 - e : e) * L);
      c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
      if (k < 1) requestAnimationFrame(pas); else c.remove();
    })(t0);
  }

  function rendre() {
    svg.querySelectorAll('.on, .gate').forEach((el) => el.classList.remove('on', 'gate'));
    paquets.textContent = '';
    let commits = 0;
    for (let k = 0; k <= i; k++) if (T[k].c) commits = Math.max(commits, T[k].c);
    for (let n = 1; n <= 6; n++) $('c' + n).classList.toggle('fait', n <= commits);
    $('branche').classList.toggle('on', i >= 0);
    const relPhase = { 2: 'conception', 3: 'plan', 4: 'tests' }[i >= 0 ? T[i].p : -1];
    $('rel-sub').textContent = relPhase ? 'neuf · relit ' + relPhase : 'un neuf par phase';
    document.querySelectorAll('.ctrl .phase').forEach((b) => b.classList.toggle('cur', i >= 0 && +b.dataset.p === T[i].p));

    if (i < 0) {
      $('l-ph').textContent = "vue d'ensemble";
      $('l-txt').textContent = "Appuie sur lecture pour suivre un chantier de l'ouverture au merge, ou choisis une phase. Chaque agent est lancé par le coordinateur, n'écrit que son document, et tout passe par garde.py.";
      return;
    }
    const t = T[i];
    t.n.forEach((id) => noeud(id).classList.add('on'));
    if (t.gate) $('n-user').classList.add('gate');
    if (t.g) $('garde').classList.add('on');
    if (t.b) $(t.b).classList.add('on');
    t.e.forEach((e) => {
      const envers = e[0] === '<', id = 'e-' + e.replace('<', '');
      const g = $(id); g.classList.add('on');
      lancerPaquet(g.querySelector('path'), envers);
    });
    const num = T.filter((x) => x.p === t.p), rang = num.indexOf(t) + 1;
    $('l-ph').innerHTML = '';
    $('l-ph').append(t.p + ' ' + PHASES[t.p] + ' · ' + rang + '/' + num.length);
    if (t.gate) { const s = document.createElement('span'); s.className = 'porte'; s.textContent = 'porte'; $('l-ph').append(s); }
    if (t.b) { const s = document.createElement('span'); s.className = 'refus'; s.textContent = 'refus'; $('l-ph').append(s); }
    $('l-txt').textContent = t.t;
  }

  function aller(k) { i = k; rendre(); planifier(); }
  function planifier() {
    clearTimeout(minuteur);
    if (!jeu) return;
    minuteur = setTimeout(() => aller(i >= T.length - 1 ? -1 : i + 1), i < 0 ? 1500 : 3400);
  }
  function basculer(on) {
    jeu = on; $('b-jeu').setAttribute('aria-pressed', on); $('b-jeu').textContent = on ? 'pause' : 'lecture';
    if (on && i >= T.length - 1) i = -1;
    if (on) aller(i < 0 ? 0 : i); else clearTimeout(minuteur);
  }
  $('b-jeu').addEventListener('click', () => basculer(!jeu));
  $('b-suiv').addEventListener('click', () => aller(Math.min(T.length - 1, i + 1)));
  $('b-prec').addEventListener('click', () => aller(Math.max(-1, i - 1)));

  rendre();
  if (!lent.matches) setTimeout(() => { if (i < 0 && !jeu) basculer(true); }, 1200);
})();

// Thème clair/sombre : choix mémorisé, sinon préférence système (déjà appliqué en tête de page).
(function () {
  const root = document.documentElement, btn = document.querySelector('.theme-btn');
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const stocke = () => { try { return localStorage.getItem('theme'); } catch { return null; } };
  const appliquer = (v, garder) => {
    root.dataset.theme = v;
    if (garder) try { localStorage.setItem('theme', v); } catch { /* stockage indisponible */ }
  };
  appliquer(stocke() || (systemDark.matches ? 'dark' : 'light'), false);
  btn?.addEventListener('click', () => {
    const suivant = root.dataset.theme === 'dark' ? 'light' : 'dark';
    window.rrThemeTransition(btn, () => appliquer(suivant, true));
  });
  systemDark.addEventListener('change', (e) => { if (!stocke()) appliquer(e.matches ? 'dark' : 'light', false); });
})();

---
audience: Ingénieurs et développeurs.
category: Python
duration: 4j  -  28h00
id: PYA
objectives:
- Mettre en œuvre des patrons de conception idiomatiques en Python (décorateur, singleton,
  stratégie, observateur)
- 'Utiliser les techniques avancées du langage Python : gestionnaires de contexte,
  métaclasses, fermetures, générateurs'
- Profiler un programme et accélérer ses traitements par la concurrence et le parallélisme
- Packager et publier une bibliothèque Python testée et typée
- Exploiter les principales bibliothèques de l'écosystème Python (calcul scientifique,
  apprentissage automatique, XML, réseau)
prerequisites: "Bonnes connaissances en développement Python."
price: 990.0
program:
  parts:
  - items:
    - Affectation par référence, types modifiables (mutable) et non modifiables (immutable).
    - Passage d'arguments, valeurs par défaut et variables locales.
    - Variables de classe et d'instance.
    - Les slices et structures de données avancées (module collections).
    - L'introspection.
    - 'Éléments avancés des structures de contrôle : la clause else des instructions
      for, while, try/except.'
    num: 1
    practice: 'Optimisation : intersection de listes et calcul de complexité d''algorithmes.'
    title: Rappels importants sur le langage
  - items:
    - Fermetures (closures) et portée des variables (nonlocal).
    - Décorateurs avec et sans paramètres, functools.wraps.
    - Générateurs, yield from et pipelines de traitement.
    - Décorateurs et patrons de conception (registre, observateur).
    num: 2
    practice: Chaînage de consommateurs de données. Abonnement à des événements via
      les décorateurs.
    title: Fonctions avancées
  - items:
    - Les propriétés (property) et les descripteurs.
    - 'Le protocole d''itération : itérateurs et générateurs.'
    - Les dataclasses.
    - L'héritage multiple, le MRO et ses travers.
    - Les gestionnaires de contexte (with, contextlib).
    - Les classes abstraites (ABC) et les protocoles (typing.Protocol).
    - Les métaclasses.
    num: 3
    practice: Implémenter une métaclasse pour créer des classes de type singleton.
    title: Programmation orientée objet avancée
  - items:
    - Gérer environnements et dépendances (venv, pip, uv).
    - Décrire un projet avec pyproject.toml.
    - Construire et publier un paquet (build, twine, TestPyPI et PyPI).
    - Annotations de type et vérification statique (mypy).
    - Tests unitaires avec pytest.
    - Formatage et analyse statique (Ruff).
    num: 4
    practice: Packager une bibliothèque testée et typée, puis la publier sur TestPyPI.
    title: Packaging et qualité
  - items:
    - Profiler un programme avec timeit et cProfile.
    - 'Threads, processus et sous-interpréteurs : GIL, build free-threaded de Python
      3.14, concurrent.futures.'
    - Programmation asynchrone avec asyncio.
    - Calcul distribué avec Celery.
    num: 5
    practice: Répartition et consolidation (Map Reduce) de calculs avec Celery.
    title: 'Le parallélisme : optimiser les performances de vos programmes'
  - items:
    - Calcul scientifique et statistiques avec NumPy, SciPy, Matplotlib et pandas.
    - Apprentissage automatique avec scikit-learn.
    - Recherche d'informations dans des fichiers XML avec ElementTree.
    - 'Réseau : relais TCP avec Twisted et supervision SNMP avec PySNMP.'
    num: 6
    practice: Extraction d'informations dans des fichiers de log XML, filtres et statistiques
      sur les données collectées puis représentation à l'aide de graphiques des tendances
      des informations.
    title: Les bibliothèques qui font le succès du langage
short: Le langage Python s'impose aujourd'hui comme un socle technologique pour le
  développement de grands projets logiciels. Vous mettrez en œuvre, dans cette formation,
  les techniques avancées du langage Python ainsi que ses principales bibliothèques afin
  de pouvoir répondre aux exigences de qualité de ces projets.
title: Python, perfectionnement

---
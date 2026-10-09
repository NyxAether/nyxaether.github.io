---
audience: Développeurs, ingénieurs, chefs de projet proches du développement.
category: Python
duration: 5j  -  35h00
id: PYT
objectives:
- Écrire des programmes Python structurés en fonctions et en modules
- Concevoir et implémenter un ensemble de classes en appliquant les principes objet
- Utiliser la bibliothèque standard pour manipuler fichiers, textes et bases de données
- Réaliser une interface graphique avec Tkinter
- Mettre en place des tests automatisés et des outils d'analyse de la qualité du code
- Appeler du code C depuis Python et compiler une extension avec Cython
prerequisites: "Connaissances de base en programmation."
price: 1200.0
program:
  parts:
  - items:
    - Les identifiants et les références. Les conventions de codage et les règles
      de nommage.
    - Les blocs, les commentaires.
    - Les types de données disponibles.
    - L'affichage formaté (f-strings), la portée locale et globale.
    - La manipulation des types numériques, la manipulation de chaînes de caractères.
    - La manipulation des listes, tuples, ensembles et dictionnaires.
    - Les compréhensions de listes et de dictionnaires.
    - L'utilisation des fichiers (open, with, pathlib).
    - La structure conditionnelle if/elif/else.
    - Le filtrage par motif (match/case).
    - Les opérateurs logiques et les opérateurs de comparaison.
    - Les boucles d'itérations while et for. Interruption d'itérations break/continue.
    - La fonction range.
    - L'écriture et la documentation de fonctions.
    - Les expressions lambda.
    - Les générateurs.
    - La gestion des erreurs par exceptions (try/except/finally, raise).
    - La structuration du code en modules.
    num: 1
    practice: Installation de Python avec uv, création d'un projet et écriture de premiers
      scripts (manipulation de collections, fichiers, fonctions).
    title: Syntaxe du langage Python
  - items:
    - Les principes du paradigme Objet.
    - La définition d'un objet (état, comportement, identité).
    - La notion de classe, d'attributs et de méthodes.
    - L'encapsulation des données.
    - La communication entre les objets.
    - L'héritage, transmission des caractéristiques d'une classe.
    - La notion de polymorphisme.
    - Association entre classes.
    - Les interfaces.
    - Les diagrammes de classes, de séquences, d'activités…
    - Notion de modèle de conception (Design Pattern).
    num: 2
    practice: Mise en œuvre d'un ensemble de classes associées entre elles.
    title: Approche Orientée Objet
  - items:
    - Les particularités du modèle Objet de Python.
    - L'écriture de classes et leur instanciation.
    - Le constructeur __init__ et le cycle de vie des objets.
    - 'L''encapsulation : conventions de visibilité (_, __) et propriétés (@property).'
    - La nécessité du paramètre self.
    - Les attributs et méthodes de classe, les méthodes statiques.
    - L'héritage simple, l'héritage multiple, le polymorphisme.
    - Les méthodes spéciales.
    - L'introspection.
    - 'Les interfaces : classes abstraites (abc) et protocoles (typing.Protocol).'
    - Les dataclasses.
    - Les annotations de type et leur vérification (mypy).
    - Les bonnes pratiques et les modèles de conception courants.
    num: 3
    practice: Pratique des concepts objet au travers de l'implémentation d'une étude
      de cas fil rouge.
    title: Programmation Objet en Python
  - items:
    - Les arguments de la ligne de commande (sys.argv, argparse).
    - L'utilisation du moteur d'expressions régulières Python avec le module re, les
      caractères spéciaux, les quantificateurs.
    - La manipulation du système de fichiers.
    - 'Présentation de modules importants de la bibliothèque standard : sys, os, pathlib,
      json, logging.'
    - Environnements virtuels, dépendances et empaquetage d'un projet (pyproject.toml,
      uv).
    - Les accès aux bases de données relationnelles, le fonctionnement de la DB API.
    num: 4
    practice: 'Mise en œuvre de modules de la bibliothèque standard : script en ligne
      de commande, expressions régulières, accès à une base SQLite.'
    title: La bibliothèque standard
  - items:
    - Les outils d'analyse statique et de formatage (Ruff, Pylint, mypy).
    - L'analyse des comptes rendus d'analyse (types de messages, avertissements, erreurs).
    - L'extraction automatique de documentation (docstrings, Sphinx).
    - Le débogueur de Python (exécution pas à pas et analyse post-mortem).
    - Le développement piloté par les tests.
    - Les frameworks de tests unitaires (unittest, pytest).
    - L'automatisation des tests, l'agrégation de tests.
    - La mesure de la couverture de code (coverage.py).
    num: 5
    practice: Mise en place de Ruff, mypy et pytest avec mesure de couverture sur un
      projet existant.
    title: Qualité du code et tests
  - items:
    - Les principes de programmation des interfaces graphiques.
    - 'Présentation de bibliothèques graphiques : Tkinter, PySide6/PyQt6 (Qt 6), PyGObject
      (GTK), wxPython.'
    - Les principaux conteneurs.
    - Présentation des widgets disponibles (Button, Radiobutton, Entry, Label, Listbox,
      Canvas, Menu, Scrollbar, Text…).
    - La fenêtre principale et les fenêtres secondaires.
    - Le placement des widgets (pack, grid, place).
    - La gestion des événements, l'objet event.
    - Utilisation du Modèle-Vue-Contrôleur dans une IHM.
    num: 6
    practice: Conception d'une interface graphique avec la bibliothèque Tkinter.
    title: Création d'interfaces graphiques
  - items:
    - Présentation du module ctypes.
    - Le chargement d'une bibliothèque C.
    - L'appel d'une fonction C.
    - Présentation de Cython.
    - Compilation d'un module Python en extension C avec Cython.
    - Le typage statique avec Cython (mode Python pur, annotations).
    - L'utilisation du profileur de code.
    num: 7
    practice: Appel de fonctions écrites en C depuis Python. Compilation d'une extension
      pour Python.
    title: Interfaçage Python/C
  - items:
    - Analyse critique de Python.
    - 'L''évolution du langage (Python 3.14 et 3.15 : mode free-threaded, t-strings,
      annotations différées).'
    - Éléments de webographie et de bibliographie.
    num: 8
    title: Conclusion
short: Python est un langage de programmation multiplateforme permettant le développement
  d'une grande variété d'applications. Vous en maîtriserez la syntaxe, les principaux
  mécanismes et le paradigme Objet. Vous découvrirez les fonctionnalités de la bibliothèque
  standard, implémenterez des interfaces graphiques, accéderez aux données d'une base
  tout en utilisant des outils permettant de tester et d'évaluer la qualité du code
  produit.
title: L'essentiel de Python et de l'objet

---
---
audience: Développeurs, ingénieurs et toute personne analysant les données avec des
  compétences de développement.
category: Machine Learning -- Data-science
duration: 2j  -  14h00
id: PND
objectives:
- Importer, décrire et nettoyer un jeu de données avec pandas (valeurs manquantes,
  dates, chaînes)
- Résumer des données par groupes avec groupby, agrégations personnalisées, apply
  et transform
- Restructurer des données avec des tableaux croisés et des passages entre formats
  large et long
- Combiner plusieurs tables par concaténation et jointures
- Diagnostiquer et accélérer un traitement pandas lent (vectorisation, types adaptés,
  Numba)
- Écrire du code pandas lisible et reproductible (chaînage de méthodes, environnement
  isolé)
prerequisites: "Maîtrise de Python. Premières manipulations avec pandas."
price: 850.0
program:
  parts:
  - items:
    - Rappels sur les structures de pandas (Series, DataFrame, index).
    - 'Nouveautés de pandas 3 : Copy-on-Write, type chaîne par défaut, expressions
      pd.col().'
    - Lecture de fichiers de données (CSV, Excel, SQL, Parquet).
    - Description d'un jeu de données et statistiques descriptives.
    - Visualisations adaptées au type de données.
    - Gestion des données manquantes.
    - Manipulation des dates et des séries temporelles.
    - Traitement des chaînes de caractères.
    - 'Code lisible et reproductible : chaînage de méthodes, environnement isolé.'
    num: 1
    practice: Mise en place d'un environnement de travail (uv, JupyterLab ou VS Code),
      lecture de fichiers CSV, Excel et Parquet, description statistique et visualisation
      d'un jeu de données.
    title: Tour d'horizon de pandas
  - items:
    - Groupby à simple indice avec les fonctions d'agrégation classiques.
    - Personnalisation des fonctions d'agrégation.
    - Agrégations nommées et filtrage de groupes (filter).
    - Groupby à multiples indices.
    - Groupes de variables catégorielles (paramètre observed).
    - Rappels sur les fonctions anonymes.
    - Différence entre les fonctions apply et transform.
    num: 2
    practice: Sur 2 jeux de données économiques, mise en pratique du groupby et visualisation
      des données. Création d'un jeu de données fictif et utilisation du groupby.
    title: Maîtriser les subtilités du groupby
  - items:
    - Fonctions d'agrégation et tableaux croisés dynamiques (pivot_table).
    - Tables de contingence (crosstab) et normalisation.
    - Passage entre formats large et long (melt, stack, unstack).
    num: 3
    practice: Sur 2 jeux de données économiques, construction de tableaux croisés et
      restructuration des données.
    title: Tableaux croisés et restructuration
  - items:
    - Notions d'axes.
    - Concaténation.
    - Merge selon une ou plusieurs clés.
    - Types de jointure (inner, left, outer) et contrôle des cardinalités (validate,
      indicator).
    - Jointure par rapport aux indices.
    num: 4
    practice: Sur 2 jeux de données économiques, mise en pratique des différents types
      de jointures.
    title: Jointure de tables
  - items:
    - 'Mesurer avant d''optimiser : profilage et empreinte mémoire (memory_usage).'
    - 'Éviter les boucles : vectorisation et opérations NumPy.'
    - 'Types adaptés : catégories, réduction de précision (downcast), types Arrow.'
    - Compilation à la volée avec Numba (engine="numba").
    - Expressions évaluées avec eval et query.
    - 'Données plus grandes que la mémoire : lecture partielle, traitement par morceaux,
      Parquet.'
    num: 5
    practice: Sur un jeu de données volumineux, mise en pratique des différentes notions
      abordées lors du cours.
    title: Accélération du calcul avec pandas
short: 'Vous utilisez déjà pandas et souhaitez aller plus loin ? Cette formation vous
  apprend à regrouper, restructurer, joindre et accélérer vos traitements de données,
  à jour de pandas 3.'
title: 'Python, Pandas avancé'

---
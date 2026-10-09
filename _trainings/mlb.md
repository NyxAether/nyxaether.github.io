---
audience: Ingénieurs et chefs de projet souhaitant appliquer l'apprentissage automatique
  à des problèmes industriels.
category: Machine Learning -- Data-science
duration: 4j  -  28h00
id: MLB
objectives:
- Choisir une famille d'algorithmes adaptée à un problème industriel
- Modéliser un problème pratique sous forme d'une tâche d'apprentissage
- Mettre en place un protocole d'évaluation et comparer des modèles
- Entraîner des modèles fréquentistes et bayésiens avec Python
- Déployer et suivre un modèle en production
prerequisites: "Connaissances de base en Python. Connaissances de base en statistiques."
price: 990.0
program:
  parts:
  - demo: Prise en main de l'environnement Python (uv, JupyterLab, scikit-learn) et
      visualisation de plusieurs exemples de modèles fournis.
    items:
    - 'Le Machine Learning : définitions, usages industriels et limites.'
    - 'Les apprentissages supervisé, non supervisé et par renforcement : panorama.'
    - Les étapes de construction d'un modèle prédictif.
    - Détecter les valeurs aberrantes et traiter les données manquantes.
    - Le choix de l'algorithme, des variables et des hyperparamètres.
    num: 1
    title: Introduction au Machine Learning
  - items:
    - Découpage en jeux d'apprentissage, de validation et de test ; validation croisée.
    - Fuite de données et représentativité de l'échantillon d'apprentissage.
    - Métriques de régression (MAE, RMSE, R²).
    - Matrice de confusion, précision, rappel, F1, courbe ROC et AUC.
    - Matrice de coût et choix du seuil de décision.
    - Surapprentissage et recherche d'hyperparamètres.
    num: 2
    practice: Évaluation et comparaison des différents algorithmes sur les modèles
      fournis.
    title: Procédures d'évaluation de modèles
  - items:
    - Modèles linéaires et régularisation.
    - Machines à vecteurs de support et méthodes à noyaux.
    - Arbres de décision, forêts aléatoires et gradient boosting.
    - Réseaux de neurones et introduction au Deep Learning.
    - Réduction de dimension et quantification vectorielle (k-means).
    - 'Les algorithmes de bandits : optimisme face à l''incertitude.'
    num: 3
    practice: Comparaison de modèles linéaires, SVM, ensembles et réseau de neurones
      sur un cas industriel.
    title: Les modèles prédictifs, l'approche fréquentiste
  - items:
    - Principes d'inférence et d'apprentissage bayésiens.
    - 'Modèles graphiques : réseaux bayésiens, champs de Markov, inférence et apprentissage.'
    - 'Modèles probabilistes : Naive Bayes, mélanges de gaussiennes (EM), processus
      gaussiens.'
    - 'Modèles markoviens : processus markoviens, chaînes de Markov, chaînes de Markov
      cachées, filtrage bayésien.'
    num: 4
    practice: 'Modélisation probabiliste d''un procédé : classification bayésienne
      et détection d''états cachés par HMM.'
    title: Les modèles et apprentissages bayésiens
  - items:
    - Les spécificités du développement d'un modèle en environnement distribué.
    - L'entraînement distribué avec Spark et l'API spark.ml.
    - Suivi d'expériences et registre de modèles (MLflow).
    - 'Exposition d''un modèle : traitement par lots et service par API.'
    - 'Les plateformes cloud de ML : Amazon SageMaker AI, Azure Machine Learning.'
    - Surveillance de la dérive des données et réentraînement.
    num: 5
    practice: Mise en production d'un modèle prédictif avec l'intégration dans des
      processus de batch et dans des flux de traitements.
    title: Machine Learning en production
short: Le Machine Learning regroupe les méthodes qui permettent d'extraire automatiquement
  des données des modèles de prédiction et de décision. Durant ce cours, vous mettrez
  en œuvre les principaux algorithmes du domaine et appréhenderez les bonnes pratiques
  d'un projet de Machine Learning, jusqu'à la mise en production.
title: Machine learning, méthodes et solutions

---
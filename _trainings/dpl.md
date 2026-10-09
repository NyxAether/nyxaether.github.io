---
audience: Ingénieurs/Chefs de projet IA, consultants IA et toute personne souhaitant
  découvrir les techniques Deep Learning dans la résolution de problèmes industriels.
category: Deep Learning
duration: 3j  -  21h00
id: DPL
objectives:
- Expliquer les facteurs du succès actuel du Deep Learning
- Construire et entraîner des réseaux de neurones avec Keras 3
- Diagnostiquer un entraînement à partir des courbes d'apprentissage et choisir les
  leviers adaptés (initialisation, optimiseur, régularisation)
- Choisir une architecture adaptée au type de données (tabulaires, images, séquences)
- Réutiliser un modèle pré-entraîné par apprentissage par transfert
- Apprendre une représentation compacte des données avec un autoencodeur
prerequisites: "Pratique de Python et de NumPy. Bonnes connaissances en statistiques.
  Connaissances du Machine Learning équivalentes à celles apportées par la formation
  Machine learning, méthodes et solutions."
price: 990.0
program:
  parts:
  - items:
    - 'Du perceptron au Deep Learning : les facteurs du succès actuel (données, GPU,
      architectures).'
    - L'environnement de travail (uv, JupyterLab ou VS Code, GPU local ou dans le cloud).
    - Tenseurs, différentiation automatique et descente de gradient.
    - Régression linéaire et logistique, de l'implémentation manuelle à l'API Keras.
    - Chargement des données par lots.
    - Sauvegarde d'un modèle et suivi des courbes d'apprentissage avec TensorBoard.
    num: 1
    practice: Implémentation d'une régression par descente de gradient, d'abord avec
      les tenseurs puis avec l'API Keras.
    title: Fondamentaux et premier réseau
  - items:
    - Le perceptron multicouche et les fonctions d'activation.
    - Fonctions de perte et rétropropagation.
    - Entraîner un perceptron multicouche avec l'API Keras.
    - Écrire une boucle d'entraînement personnalisée.
    - Réglage des hyperparamètres (taux d'apprentissage, taille de lot) avec KerasTuner.
    num: 2
    practice: Classification d'un jeu de données avec un perceptron multicouche.
    title: Introduction aux réseaux de neurones artificiels
  - items:
    - Disparition et explosion des gradients ; initialisation et normalisation des
      couches.
    - Optimiseurs (momentum, Adam, AdamW) et planification du taux d'apprentissage.
    - 'Régularisation : pénalité L2, dropout, augmentation de données, arrêt anticipé.'
    - Entraînement sur GPU et précision mixte.
    - Diagnostic d'un entraînement à partir des courbes d'apprentissage.
    num: 3
    practice: Diagnostic et amélioration d'un réseau profond qui sur-apprend ou ne
      converge pas.
    title: Entraînement de réseaux de neurones profonds
  - items:
    - L'architecture du cortex visuel.
    - Couches de convolution et de pooling.
    - Architectures de CNN (LeNet, VGG, ResNet, EfficientNet).
    - Apprentissage par transfert à partir d'un modèle pré-entraîné.
    num: 4
    practice: Mise en œuvre des CNN en utilisant des jeux de données variés.
    title: Réseaux de neurones convolutifs
  - items:
    - Neurones récurrents et rétropropagation dans le temps.
    - Cellules LSTM et GRU.
    - Le mécanisme d'attention.
    - L'architecture Transformer.
    - Réutiliser un Transformer pré-entraîné (KerasHub ou Hugging Face) pour une tâche
      de texte.
    num: 5
    practice: Classification de textes avec un RNN, puis par ajustement fin d'un Transformer
      pré-entraîné.
    title: Séquences, attention et Transformers
  - items:
    - Représentations efficaces des données.
    - ACP avec un autoencodeur linéaire sous-complet.
    - Autoencodeurs empilés, débruiteurs et épars.
    - Autoencodeurs variationnels.
    - 'Applications : détection d''anomalies et pré-entraînement non supervisé.'
    num: 6
    practice: Mise en œuvre d'autoencodeurs en utilisant des jeux de données variés.
    title: Autoencodeurs
short: Les réseaux de neurones artificiels facilitent l'apprentissage automatique
  et bouleversent de nombreux secteurs économiques. Durant cette formation, vous utilisez
  Keras 3, l'un des outils les plus répandus du domaine, afin de concevoir et d'entraîner
  différents types de réseaux de neurones profonds sur des jeux de données diversifiés.
title: Deep Learning par la pratique

---
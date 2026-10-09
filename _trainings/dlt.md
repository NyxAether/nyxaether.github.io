---
audience: Concepteurs-développeurs en machine learning, data scientists, ingénieurs
  en IA.
category: Deep Learning
duration: 4j  -  28h00
id: DLT
objectives:
- Manipuler des tenseurs et entraîner un réseau de neurones avec PyTorch sur CPU ou
  GPU
- Construire un pipeline de chargement de données avec Dataset et DataLoader
- Entraîner un réseau de neurones à partir de zéro ou par transfer learning
- Mettre en œuvre un modèle de segmentation d'images
- Adapter un modèle transformer pré-entraîné à une tâche de traitement du langage
- Accélérer et distribuer un entraînement (précision mixte, torch.compile, DDP)
prerequisites: "Pratique de Python et du machine learning."
price: 990.0
program:
  parts:
  - items:
    - 'PyTorch et ses principes fondamentaux : tenseurs, autograd, devices.'
    - Installer PyTorch (uv, CPU/GPU) et vérifier l'accès au GPU.
    - Comparaison entre NumPy et PyTorch.
    - L'écosystème PyTorch face à TensorFlow, JAX et Keras 3.
    num: 1
    practice: Installation de PyTorch. Manipulation de tenseurs sur CPU et GPU.
    title: Prise en main de PyTorch
  - items:
    - Présentation des sous-modules de PyTorch (torch.nn, torch.optim, torch.utils.data).
    - Rappels sur la propagation avant et la rétropropagation des gradients.
    - Chargement des données avec Dataset et DataLoader.
    - Définir un réseau de neurones convolutif avec torch.nn, l'entraîner et le tester.
    - Sauvegarde et reprise d'un modèle (state_dict, checkpoints).
    - 'Accélérer l''entraînement : précision mixte (torch.amp) et torch.compile.'
    - 'Principes de l''entraînement distribué : DDP et FSDP2.'
    num: 2
    practice: Mise en place d'un CNN pour la classification d'images, puis accélération
      de son entraînement.
    title: Entraîner un réseau de neurones avec PyTorch
  - items:
    - Principe du transfer learning.
    - Exemples de mise en œuvre de l'apprentissage par transfert.
    - Les étapes de la méthode de transfer learning dans les projets de machine learning.
    - Charger des poids pré-entraînés (torchvision, timm, Hugging Face Hub) ; gel des
      couches ou fine-tuning complet.
    num: 3
    practice: Reprise d'exercices précédents, pour améliorer les métriques avec la
      mise en place du transfer learning.
    title: Transfer learning et utilisation de réseaux pré-entraînés
  - items:
    - Panorama des architectures de détection d'objets.
    - Problématique de segmentation d'images.
    - 'L''architecture réseau UNet : les blocs codeur-décodeur et PyTorch.'
    num: 4
    practice: Création d'un modèle UNet simple pour la segmentation d'images. Comparaison
      avec le transfer learning pour UNet.
    title: Architectures pour la détection et la segmentation
  - items:
    - Le traitement automatique du langage naturel (NLP, pour Natural Language Processing).
    - Prétraitement et tokenisation du texte (spaCy, tokenizers en sous-mots).
    - Plongements de mots et réseaux récurrents (LSTM).
    - Limites des réseaux récurrents face aux longues séquences.
    num: 5
    practice: Classification de sentiments sur des avis avec un LSTM.
    title: Le NLP avec PyTorch
  - items:
    - Le mécanisme d'attention et l'auto-attention.
    - 'Architecture d''un transformer : encodeur, décodeur, encodage positionnel.'
    - Implémenter un bloc d'attention en PyTorch.
    - Modèles pré-entraînés et bibliothèque Hugging Face transformers.
    - Fine-tuning d'un modèle pré-entraîné sur une tâche de classification ou de traduction.
    - Les transformers au-delà du texte (Vision Transformer).
    num: 6
    practice: Fine-tuning d'un transformer pré-entraîné et comparaison avec le modèle
      LSTM.
    title: Transformers et mécanismes d'attention
short: 'Cette formation vous apprend à concevoir et entraîner des réseaux de neurones
  avec PyTorch : vision, transfer learning, segmentation, traitement du langage avec
  les transformers et techniques pour accélérer l''entraînement.'
title: Deep Learning avec PyTorch

---
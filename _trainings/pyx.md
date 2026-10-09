---
audience: Administrateurs systèmes et réseaux, ingénieurs DevOps, développeurs souhaitant
  automatiser des tâches d'exploitation.
category: Python
duration: 3j  -  21h00
id: PYX
objectives:
- Écrire des scripts Python structurés (types, contrôle de flux, fonctions, exceptions,
  fichiers)
- Choisir la bibliothèque adaptée à une tâche d'administration système
- Installer des bibliothèques tierces dans un environnement Python isolé
- Réaliser des tâches d'administration système avec des scripts Python
- Créer des classes simples pour modéliser des données
prerequisites: "Connaissances de base en algorithmique (variables, tableaux, fonctions)."
price: 850.0
program:
  parts:
  - items:
    - 'Les principaux types de données : chaînes de caractères, booléens, nombres.'
    - Tableaux indicés (listes et tuples), tableaux associatifs (dictionnaires), tableaux
      d'octets.
    - 'Les structures de contrôle : boucles for et while, test if/elif/else.'
    - Créer et utiliser des fonctions.
    - Formater des chaînes avec les f-strings.
    - Traiter les erreurs avec la gestion des exceptions try/except/finally.
    - Lire et écrire des fichiers texte et binaires.
    - 'Le principal piège de Python : types mutables et immuables.'
    num: 1
    practice: 'Exercices d''algorithmique de base pour se familiariser avec le langage
      et être à l''aise avec la manipulation de données : génération de masques d''adresses
      IP, extractions de chaînes de caractères, formatage de données…'
    title: Les bases du langage Python
  - items:
    - 'Les générateurs : utilité et création.'
    - 'Les rudiments de la programmation objet : classes, attributs, méthodes.'
    - Organiser son code en modules et en paquets réutilisables.
    - Installer des bibliothèques tierces dans un environnement isolé avec uv (projet
      ou script autonome PEP 723).
    - Manipuler adresses et réseaux IP avec le module ipaddress.
    num: 2
    practice: Créer une bibliothèque et la réutiliser dans différents scripts. Créer
      un générateur d'IP.
    title: Un peu plus loin avec Python
  - items:
    - Parcourir et manipuler le système de fichiers avec pathlib et shutil.
    - Créer et extraire des archives tar et zip.
    - Analyser des logs avec les expressions régulières.
    - Lire et écrire des fichiers CSV ; analyser des fichiers CSV/Excel avec pandas.
    - Passer des paramètres à un script avec argparse.
    - Stocker et interroger des données dans une base relationnelle (sqlite3).
    - Exécuter des commandes système avec subprocess.
    - Journaliser l'activité d'un script avec logging.
    num: 3
    practice: Recherche d'intrusions dans un fichier de logs, insertion de fichiers
      CSV dans une base relationnelle, géolocalisation d'adresses IP, création d'une
      archive tar/zip.
    title: Les bases de l'administration système
  - items:
    - Interroger une API web avec requests (JSON, authentification, codes d'erreur).
    - Envoyer des e-mails avec smtplib et email.
    - Exécuter des commandes sur plusieurs machines via SSH avec Fabric.
    - Lancer des playbooks Ansible depuis Python avec ansible-runner.
    num: 4
    practice: Collecte d'informations sur plusieurs serveurs via SSH et envoi d'un
      rapport par e-mail.
    title: Compléments d'administration système
short: 'Automatisez vos tâches d''administration avec Python : scripts, fichiers et
  logs, bases de données, API web et pilotage de plusieurs machines via SSH.'
title: Python, administration système

---
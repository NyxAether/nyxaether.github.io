---
audience: Développeurs, data scientists, DevOps et tech leads souhaitant intégrer
  un agent IA à leur façon de coder.
category: IA générative -- Agents
duration: 3j  -  21h00
id: CCD
objectives:
- Utiliser Claude Code sur une base de code réelle en gardant la maîtrise du code produit
- Fournir le bon contexte à l'agent (CLAUDE.md, mémoire, skills)
- Automatiser son flux de travail avec les hooks, les sous-agents et MCP
- Intégrer Claude Code à un workflow d'équipe (Git, revue de code, CI)
prerequisites: "Savoir programmer (Python ou autre langage). Connaissances de base
  de Git et du terminal."
price: 990.0
program:
  parts:
  - items:
    - Qu'est-ce qu'un agent de code ? Différences avec le chat et l'autocomplétion.
    - Installation, usage dans le terminal et extensions VS Code / JetBrains.
    - Choix du modèle et maîtrise des coûts.
    - Modes de permission et mode plan.
    num: 1
    practice: "Fil rouge : découverte d'une API FastAPI de gestion de formations. Faire
      expliquer l'architecture du dépôt à l'agent et en produire un schéma."
    title: Prise en main
  - items:
    - Formuler une demande efficace (contexte, contraintes, critères de réussite).
    - Le cycle explorer, planifier, coder, vérifier.
    - Gérer une longue session (/clear, compaction, reprise).
    - Relire les diffs et garder la maîtrise du code produit.
    num: 2
    practice: "Fil rouge : correction de bugs dissimulés dans l'API, puis ajout d'une
      fonctionnalité de liste d'attente accompagnée de ses tests."
    title: Travailler au quotidien avec l'agent
  - items:
    - CLAUDE.md global, projet et sous-dossiers.
    - La mémoire automatique.
    - Commandes slash et skills personnalisés.
    - Configuration (settings.json) et gestion des permissions.
    num: 3
    practice: "Fil rouge : rédaction du CLAUDE.md du projet et création d'un skill
      générant un nouvel endpoint avec son modèle et ses tests."
    title: Contexte et personnalisation
  - items:
    - Hooks pour le formatage, le lint et les garde-fous.
    - Sous-agents et parallélisation des tâches.
    - Connecter des outils externes avec MCP (base de données, documentation, outils
      internes).
    - Les plugins.
    num: 4
    practice: "Fil rouge : ajout d'un hook de lint et de tests automatiques, et connexion
      d'un serveur MCP à la base SQLite du projet."
    title: Automatisation et extension
  - items:
    - Git avec l'agent (commits, branches, worktrees).
    - Revue de code et revue de sécurité assistées.
    - Mode headless et Agent SDK, intégration continue (GitHub Actions).
    num: 5
    practice: "Fil rouge : développement de deux fonctionnalités en parallèle via
      des worktrees, ouverture d'une pull request et mise en place d'une revue automatique
      en CI."
    title: Workflow d'équipe
  - items:
    - Sécurité (secrets, commandes destructrices, injection de prompt).
    - Coûts et consommation de tokens.
    - Savoir quand ne pas déléguer à l'agent.
    num: 6
    practice: "Fil rouge : réalisation en autonomie d'une fonctionnalité complète,
      l'export PDF des attestations de formation."
    title: Bonnes pratiques et limites
short: Les agents de code transforment la façon de développer. Cette formation vous
  apprend à travailler efficacement avec Claude Code sur un projet réel, de la première
  demande jusqu'à l'intégration dans le workflow de votre équipe, sans perdre la maîtrise
  de votre code.
title: Claude Code, développer avec un agent IA

---

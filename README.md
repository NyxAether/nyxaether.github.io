# Site personnel — Romain Rincé

> Statique · Jekyll · GitHub Pages

## Structure

```
├── _config.yml            # Configuration Jekyll
├── _layouts/
│   └── default.html       # Layout principal (head, nav, footer, modal)
├── _trainings/            # Données des formations 
├── assets/
│   ├── css/styles.css     # Styles CSS
│   └── js/scripts.js      # JavaScript (animation, modals, thème)
├── index.html             # Page d'accueil (template Liquid + frontmatter)
```

## Données des formations

Les fichiers `.yml` dans `_trainings/` sont chargés par Jekyll au build
et injectés en JSON dans la page. Le JavaScript les lit depuis ce blob
embarqué — plus besoin de `fetch()` ni de parser YAML côté client.

Pour ajouter une formation, crée un fichier `.yml` dans `_data/trainings/`
suivant le format existant (id, title, short, duration, price, …).

## Build local

```bash
# Installer Jekyll (Ruby requis)
bundle install

# Lancer le serveur de développement
bundle exec jekyll serve --livereload
```

Ou sans Bundler :

```bash
jekyll serve --livereload
```

Le site sera disponible sur `http://localhost:4000`.

## GitHub Pages

1. Pousser le repo vers GitHub (ex: `nyxaether.github.io` ou `nyxaether/mon-site`)
2. Dans Settings → Pages, choisir la branche `main` et le dossier `/` (Root)
3. Le site sera publié automatiquement à chaque push

> **Note** : Si tu utilises un nom de domaine personnalisé (romainrince.fr),
> mets-toi un fichier `CNAME` à la racine avec ton domaine, et ajuste
> `url:` dans `_config.yml`.

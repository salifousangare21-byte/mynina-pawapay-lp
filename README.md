# MyNina — LP test PawaPay + Muvi

Landing page de test pour l'intégration PawaPay (mobile money) + Make + Muvi
(abonnements et réabonnements MyNina).

## Structure
- `index.html` — page d'accueil (carrousel des programmes)
- `programme.html` — page programme + popup de paiement
- `app.js` — logique LP : initiation du paiement via le Worker Cloudflare, polling du statut réel
- `style.css` — styles
- `_redirects` — routage Cloudflare Pages (`/programmes/*` → `programme.html`)
- `assets/` — vidéos, vignettes, logo

## Déploiement
Hébergé sur Cloudflare Pages, connecté à ce repo (déploiement auto sur push vers `main`).

## Dépendance
Le paiement est initié par un Worker Cloudflare séparé (voir `WORKER_BASE_URL` dans `app.js`),
qui appelle l'API PawaPay et sert de proxy pour le statut réel du dépôt.

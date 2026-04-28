# Frontend - Espace Numerique de Travail

Application frontend du projet ENT developpee avec React, Vite et Tailwind CSS.

Elle permet :
- la connexion des utilisateurs
- l'affichage du tableau de bord
- la gestion des personnels
- la gestion des activites
- la consultation et modification du profil utilisateur
- la preparation du projet pour un fonctionnement en PWA

## Stack technique

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- vite-plugin-pwa

## Prerequis

Avant de lancer le frontend, il faut avoir :

- Node.js 18 ou plus
- npm
- le backend Laravel fonctionnel

## Installation

Depuis le dossier `frontend` :

```bash
npm install
```

## Lancement en developpement

```bash
npm run dev
```

Par defaut, Vite lance l'application sur une adresse proche de :

```bash
http://localhost:5173
```

## Build production

```bash
npm run build
```

Pour previsualiser le build :

```bash
npm run preview
```

## Configuration API

Le frontend communique avec le backend Laravel via Axios.

Tu peux definir l'URL de base de l'API avec :

```env
VITE_API_BASE_URL=http://localhost:8000
```

Exemple de fichier `.env` dans le dossier `frontend` :

```env
VITE_API_BASE_URL=http://localhost:8000
```

Si cette variable n'est pas definie, le frontend utilise par defaut :

```txt
http://localhost:8000
```

## Authentification

Le projet utilise l'authentification avec Sanctum cote backend.

Fonctionnement global :

1. le frontend recupere le cookie CSRF
2. l'utilisateur se connecte avec son matricule et son mot de passe
3. le backend retourne un token et les informations du profil
4. le token est stocke dans `localStorage`
5. le frontend recharge l'utilisateur connecte avec la route `/api/me`

## Gestion des roles

Deux roles sont utilises :

- `Administrateur`
- `Simple utilisateur`

### Administrateur

Peut :
- voir les pages
- creer des personnels
- modifier des personnels
- supprimer des personnels
- creer des activites
- modifier des activites
- supprimer des activites
- modifier tous les champs de son profil

### Simple utilisateur

Peut :
- consulter les donnees
- modifier certaines informations de son propre profil

Restrictions :
- pas de creation
- pas de suppression
- pas de modification des roles
- pas d'actions d'administration dans `Personnels` et `Activites`

## Structure du dossier `src`

```txt
src/
  components/     composants reutilisables
  context/        contexte global d'authentification
  layouts/        layouts des pages
  pages/          pages principales
  services/       appels API et services utilitaires
  App.jsx         configuration principale des routes
  main.jsx        point d'entree React
  index.css       styles globaux
```

## Pages principales

- `Login`
- `Dashboard`
- `Personnes`
- `Activites`
- `Profil`

## Fonctionnalites importantes

### Tableau de bord

- resume des activites
- consultation rapide
- bouton admin pour aller directement vers la modification d'une activite

### Personnels

- recherche
- consultation detaillee
- creation, modification et suppression reservees a l'administrateur

### Activites

- recherche
- filtre par statut
- consultation detaillee
- gestion des participants
- edition reservee a l'administrateur

### Profil

- affichage des informations du profil connecte
- modification du profil
- changement du mot de passe
- mise a jour de la photo de profil

## PWA

Le projet utilise `vite-plugin-pwa`.

Objectif :
- rendre l'application installable
- preparer un cache de base pour les assets
- offrir une meilleure experience mobile/desktop

Pour une PWA complete, il faut aussi :
- ajouter les icones `icon-192.png`
- ajouter les icones `icon-512.png`
- ajouter `apple-touch-icon.png`
- verifier l'installation en production via HTTPS

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Notes de developpement

- le projet utilise Tailwind CSS pour le style
- l'authentification depend du backend Laravel
- certaines donnees ne sont pas utilisables hors ligne sans strategie de cache API supplementaire
- la PWA est en preparation et doit etre finalisee avec les icones et les tests de production

## Auteur

Projet ENT - frontend React/Vite/Tailwind.

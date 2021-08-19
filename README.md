# Groupomania - back-end

Back-end du septième projet du parcours développeur web chez OpenClassrooms
Le projet consiste à construire un réseau social interne pour les employés de Groupomania.
Pour ce MVP, il a été décidé de partir sur un clone de 9GAG

[Repository du front-end](https://github.com/MathisBarre/MathisBarre_7_01082021_front-end)

![screenshot page des routes de l'api](https://groupomania.mathisbarre.com/images/screenshot-backend.png)

## User stories

- [x] En tant qu'employé je veux créer et me connecter à un compte
- [x] En tant qu'employé je veux pouvoir partager des GIFs
- [x] En tant qu'employé je veux pouvoir voir les GIFs des autres employés
- [x] En tant qu'employé je veux pouvoir voir et écrire des commentaires sur les publications

## Technologies utilisées

- **Front-end :** React, NextJs
- **Back-end :** Fastify, Prisma ORM & MySQL

## Installation & lancement

### 1. Pré-requis

- Node.js 14
- Yarn 1.22

### 2. Cloner le projet

```bash
$ git clone https://github.com/MathisBarre/MathisBarre_7_01082021_back-end.git
```

### 3. Installer les dépendances

```bash
$ yarn
```

### 4. Completer les variables d'environnements

Renommer le fichier `example.env` en `.env` puis vous référer au fichier afin de remplir correctement les informations

### 5. Générer la base de donnée

```
$ yarn prisma db push
$ yarn prisma generate
```

Note: il peut être nécessaire de créer la base de données au préalable.

### 6. Lancer le projet

#### Pour le développement

```bash
$ yarn dev
```

#### Pour la production

```bash
$ yarn start
```

Puis ouvrez votre navigateur à l'adresse https://localhost:3001

### 7. Installer et lancer le front-end

Instruction sur le repository : [https://github.com/MathisBarre/MathisBarre_7_01082021_front-end](https://github.com/MathisBarre/MathisBarre_7_01082021_back-end)

# Plateforme de Gestion de Projets Flowlyoratifs

Squelette de démarrage — backend Spring Boot 3.2 (Java 17) + frontend React 18 / Vite + MongoDB + Redis + Nginx, entièrement conteneurisé.

## Prérequis
- Docker Desktop
- (optionnel, pour dev sans Docker) Java 17, Node.js ≥ 18

## Démarrage rapide
```bash
cp .env.example .env
docker compose up --build
```

- Frontend : http://localhost
- API : http://localhost/api (ou http://localhost:8080/api en accès direct)
- Swagger UI : http://localhost:8080/api/swagger-ui
- Health check : http://localhost:8080/actuator/health

## Ce qui est déjà fonctionnel
- Inscription / connexion avec JWT (BCrypt, Spring Security 6)
- CRUD Projets et Tâches (backend + frontend connectés)
- Changement de statut de tâche (Kanban simplifié)
- Notifications temps réel via WebSocket / STOMP
- Audit log branché sur les actions principales (register, login, CRUD projet/tâche)
- Rôles ADMIN / MANAGER / MEMBER, contrôlés côté backend via `@PreAuthorize`
- Gestion centralisée des erreurs (`@RestControllerAdvice`)

## 
- Le rôle MANAGER n'a pas encore de restriction spécifique sur ses propres projets — à ajouter dans `ProjectService`
- Sous-tâches : le calcul de progression existe (`TaskService.computeSubtaskProgress`) mais n'est pas encore exposé par un endpoint ni affiché dans l'UI
- Drag & drop réel sur le Kanban (actuellement un simple `<select>`) — voir le TODO dans `KanbanBoard.jsx`
- Filtres sur les listes (assigné, priorité, deadline, statut) + pagination
- Interface admin pour l'audit log et export CSV (l'endpoint `/api/admin/logs` existe déjà, paginé)
- Réinitialisation de mot de passe par e-mail
- `principal.getUsername()` renvoie l'email de l'utilisateur connecté, utilisé tel quel comme identifiant dans certains services (voir commentaire dans `ProjectController`) — à remplacer par l'`_id` Mongo réel si tu veux un `ownerId` strict
- Tests unitaires et d'intégration (dossier `src/test` prêt mais vide)
- Appel `connectWebSocket()` à déclencher après login (actuellement défini mais pas encore branché dans `authSlice`)

## Structure du projet
Voir `docs/architecture.md` pour l'organisation détaillée du code et `docs/data-model.md` pour le schéma MongoDB.

## Ordre de développement recommandé
1. Vérifier que `docker compose up` démarre tous les services sans erreur
2. Tester `/api/auth/register` et `/api/auth/login` via Swagger UI ou Postman
3. Compléter les règles de rôle manquantes dans les services
4. Brancher `connectWebSocket()` après un login réussi
5. Ajouter les filtres et la pagination
6. Écrire les tests au fur et à mesure, pas à la fin

## CI/CD avec GitLab

Le fichier `.gitlab-ci.yml` définit le pipeline GitLab CI/CD :

- **Validate** : tests Maven du backend et build du frontend ;
- **Build** : construction des images Docker backend et frontend, puis publication
  dans le GitLab Container Registry sur la branche principale ;
- **Deploy** : déploiement staging manuel via SSH, après configuration des variables
  `STAGING_HOST`, `STAGING_USER`, `STAGING_SSH_PRIVATE_KEY`, `STAGING_APP_PATH`
  et `STAGING_URL`.

Pour l'exécuter, importer ce dépôt GitHub dans un nouveau projet GitLab ou le
connecter comme dépôt miroir, puis activer un GitLab Runner Docker. Chaque push
déclenche les étapes de validation et de build ; le job `deploy_staging` est
lancé depuis le bouton **Play** de GitLab.

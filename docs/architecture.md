# Architecture du projet

Voir le document "architecture-projet.md" partagé précédemment dans la conversation pour le détail complet
(structure du monorepo, couches backend Controller → Service → Repository, organisation frontend par feature,
config Docker/Nginx, et ordre de mise en place recommandé).

Résumé rapide :

- `backend/` : Spring Boot en couches (`controller/`, `service/`, `repository/`, `model/`, `dto/`, `security/`, `config/`, `exception/`)
- `frontend/` : React + Redux Toolkit organisé par feature (`features/auth`, `features/projects`, `features/tasks`, `features/notifications`)
- `docker/nginx/` : reverse proxy routant `/` vers le frontend, `/api` et `/ws` vers le backend
- `docker-compose.yml` : orchestration des 5 services (frontend, backend, mongo, redis, nginx)

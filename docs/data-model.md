# Modèle de données MongoDB

```
USERS ||--o{ PROJECTS : "cree (ownerId)"
USERS ||--o{ TASKS : "assigne a"
USERS ||--o{ NOTIFICATIONS : recoit
USERS ||--o{ AUDIT_LOGS : effectue
PROJECTS ||--o{ TASKS : contient
TASKS ||--o{ TASKS : sous_tache
```

- `Project.ownerId` référence `User._id` (créateur)
- `Project.memberIds` : liste d'IDs, relation many-to-many gérée applicativement (pas de FK stricte en NoSQL)
- `Task.projectId` référence `Project._id`
- `Task.parentTaskId` : auto-référence pour les sous-tâches (un seul niveau, voir section 2.2.3 du cahier des charges)
- `Task.assigneeId` référence `User._id`
- `AuditLog.entityType` + `entityId` : référence polymorphe (PROJECT, TASK ou USER)

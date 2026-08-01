package com.projet.collab.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String userId;

    private String type; // NOUVEAU : ex: "PROJECT_INVITE", "TASK_ASSIGNED"

    private String message;

    private Map<String, String> data; // NOUVEAU : contient {projectId, role, id de la notif}

    private boolean read;

    private String taskId;

    private String projectId;

    private LocalDateTime createdAt;

    public Notification() {
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Map<String, String> getData() { return data; }
    public void setData(Map<String, String> data) { this.data = data; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}



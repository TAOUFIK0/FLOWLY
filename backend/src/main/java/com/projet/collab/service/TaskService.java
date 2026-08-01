package com.projet.collab.service;

import com.projet.collab.dto.request.TaskRequest;
import com.projet.collab.exception.ResourceNotFoundException;

import com.projet.collab.model.Task;
import com.projet.collab.model.User;
import com.projet.collab.repository.TaskRepository;
import com.projet.collab.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public TaskService(TaskRepository taskRepository,
                      UserRepository userRepository,
                      NotificationService notificationService,
                      AuditLogService auditLogService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public List<Task> findByProjectId(String projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task create(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProjectId(request.getProjectId());

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getAssigneeId() != null) {
            task.setAssigneeId(request.getAssigneeId());
            final Task finalTask = task; 
            userRepository.findById(request.getAssigneeId()).ifPresent(user -> {
                finalTask.setAssigneeName(user.getUsername());
            });
        }
        
        if (request.getLabels() != null) {
            task.setLabels(request.getLabels());
        }

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        task = taskRepository.save(task);

        auditLogService.log(
                request.getAssigneeId() != null ? request.getAssigneeId() : "system",
                "CREATE",
                "TASK",
                task.getId()
        );

        if (request.getAssigneeId() != null) {
            notificationService.notify(
                    request.getAssigneeId(),
                    "Nouvelle tâche : " + task.getTitle(),
                    task.getId(),
                    task.getProjectId()
            );
        }

        return task;
    }

    public Task update(String taskId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Tâche non trouvée : " + taskId));

        String oldStatus = task.getStatus();

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getAssigneeId() != null) {
            task.setAssigneeId(request.getAssigneeId());
            final Task finalTask = task; // CORRIGÉ ICI AUSSI
            userRepository.findById(request.getAssigneeId()).ifPresent(user -> {
                finalTask.setAssigneeName(user.getUsername()); // CORRIGÉ ICI AUSSI
            });
        } else {
            task.setAssigneeId(null);
            task.setAssigneeName(null);
        }

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        if (request.getLabels() != null) {
            task.setLabels(request.getLabels());
        }

        task.setUpdatedAt(LocalDateTime.now());

        task = taskRepository.save(task);

        auditLogService.log(
                task.getAssigneeId() != null ? task.getAssigneeId() : "system",
                "UPDATE",
                "TASK",
                task.getId()
        );

        if (request.getStatus() != null && !request.getStatus().equals(oldStatus)) {
            String message = "Tâche '" + task.getTitle() + "' passée de " + oldStatus + " à " + request.getStatus();

            if (task.getAssigneeId() != null) {
                notificationService.notify(
                        task.getAssigneeId(),
                        message,
                        task.getId(),
                        task.getProjectId()
                );
            }

            try {
                notificationService.notify(
                        "system",
                        message,
                        task.getId(),
                        task.getProjectId()
                );
            } catch (Exception ignored) {
            }
        }

        return task;
    }

    public void delete(String taskId) {
        taskRepository.deleteById(taskId);
    }

    public Task addComment(String taskId, String userId, String text) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Tâche non trouvée : " + taskId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Map<String, Object> comment = new HashMap<>();
        comment.put("id", "c-" + System.currentTimeMillis());
        comment.put("text", text);
        comment.put("author", Map.of("name", user.getUsername()));
        comment.put("createdAt", "à l'instant");

        if (task.getComments() == null) {
            task.setComments(new ArrayList<>());
        }
        task.getComments().add(comment);
        
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }
}

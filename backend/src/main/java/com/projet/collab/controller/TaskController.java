package com.projet.collab.controller;

import com.projet.collab.dto.request.TaskRequest;
import com.projet.collab.model.Task;
import com.projet.collab.model.User;
import com.projet.collab.repository.UserRepository;
import com.projet.collab.service.TaskService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @GetMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<List<Task>> findByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(taskService.findByProjectId(projectId));
    }

    @GetMapping("/api/boards/{boardId}/tasks")
    public ResponseEntity<List<Task>> findByBoard(@PathVariable String boardId) {
        return ResponseEntity.ok(taskService.findByProjectId(boardId));
    }

    @PostMapping("/api/tasks")
    public ResponseEntity<Task> create(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.create(request));
    }

    @PatchMapping("/api/tasks/{taskId}")
    public ResponseEntity<?> update(@PathVariable String taskId,
                                    @RequestBody TaskRequest request) {
        try {
            return ResponseEntity.ok(taskService.update(taskId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/api/tasks/{taskId}")
    public ResponseEntity<?> delete(@PathVariable String taskId) {
        try {
            taskService.delete(taskId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /* --- AJOUTER UN COMMENTAIRE --- */
    @PostMapping("/api/tasks/{taskId}/comments")
    public ResponseEntity<?> addComment(@PathVariable String taskId,
                                        @RequestBody Map<String, String> body,
                                        Authentication authentication) {
        try {
            String userId = getUserId(authentication);
            Task task = taskService.addComment(taskId, userId, body.get("text"));
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /* --- UTILITAIRE --- */
    private String getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return user.getId();
    }
}

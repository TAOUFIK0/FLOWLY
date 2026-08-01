package com.projet.collab.controller;

import com.projet.collab.dto.MemberProgressDto;
import com.projet.collab.dto.request.ProjectRequest;
import com.projet.collab.model.Notification;
import com.projet.collab.model.Project;
import com.projet.collab.model.User;
import com.projet.collab.repository.ProjectRepository;
import com.projet.collab.repository.UserRepository;
import com.projet.collab.service.NotificationService;
import com.projet.collab.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository; 
    private final NotificationService notificationService; 

    public ProjectController(ProjectService projectService, 
                            UserRepository userRepository,
                            ProjectRepository projectRepository,
                            NotificationService notificationService) {
        this.projectService = projectService;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.notificationService = notificationService;
    }

    /* =========================================
       NOUVEAU ENDPOINT TABLEAU DE BORD
       ========================================= */

    @GetMapping("/{projectId}/dashboard-stats")
    public ResponseEntity<List<MemberProgressDto>> getProjectDashboardStats(@PathVariable String projectId) {
        List<MemberProgressDto> stats = projectService.calculateMemberProgress(projectId);
        return ResponseEntity.ok(stats);
    }

    /* =========================================
       ENDPOINTS ORIGINAUX
       ========================================= */

    @GetMapping
    public ResponseEntity<List<Project>> findAll(Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(projectService.findAll(userId));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ProjectRequest request,
                                    Authentication authentication) {
        try {
            String userId = getUserId(authentication);
            Project project = projectService.create(request, userId);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/templates")
    public ResponseEntity<List<Map<String, Object>>> getTemplates() {
        List<Map<String, Object>> templates = List.of(
                Map.of("id", "blank", "name", "Vide", "description", "Un tableau vierge", "columns", List.of("À faire", "En cours", "Terminé")),
                Map.of("id", "kanban-basic", "name", "Kanban simple", "description", "Le modèle standard", "columns", List.of("À faire", "En cours", "En revue", "Terminé")),
                Map.of("id", "sprint", "name", "Sprint agile", "description", "Adapté au suivi de sprint", "columns", List.of("Backlog", "À faire", "En cours", "Tests", "Terminé"))
        );
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(projectService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /* =========================================
       GESTION DES MEMBRES & RÔLES
       ========================================= */

    @GetMapping("/{id}/members")
    public ResponseEntity<?> getMembers(@PathVariable String id, Authentication authentication) {
        try {
            String currentUserId = getUserId(authentication);
            return ResponseEntity.ok(projectService.getMembersWithRoles(id, currentUserId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{projectId}/members/{userId}/role")
    public ResponseEntity<?> updateMemberRole(
            @PathVariable String projectId,
            @PathVariable String userId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {

        try {
            String requesterId = getUserId(authentication);
            String newRole = body.get("role");
            projectService.updateMemberRole(projectId, requesterId, userId, newRole);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        }
    }

    /* =========================================
       SYSTEME D'INVITATION
       ========================================= */

    @PostMapping("/{id}/invitations")
    public ResponseEntity<?> inviteMember(@PathVariable String id, 
                                         @RequestBody Map<String, String> body, 
                                         Authentication authentication) {
        try {
            String requesterId = getUserId(authentication);
            String email = body.get("email");
            String role = body.get("role");

            Project project = projectService.findById(id);

            String requesterRole = project.getMemberRoles().get(requesterId);
            if (!"OWNER".equals(requesterRole) && !"MANAGER".equals(requesterRole)) {
                return ResponseEntity.status(403).body(Map.of("message", "Seul un Owner ou Manager peut inviter."));
            }

            User targetUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec cet email"));

            if (project.getMemberIds().contains(targetUser.getId())) {
                return ResponseEntity.status(409).body(Map.of("message", "Cet utilisateur est déjà membre du projet."));
            }

            String notifId = "notif-" + System.currentTimeMillis();
            notificationService.sendInvitation(targetUser.getId(), project.getId(), project.getName(), role, notifId);

            return ResponseEntity.ok().body(Map.of("message", "Invitation envoyée avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/invitations/{notificationId}/respond")
    public ResponseEntity<?> respondToInvitation(@PathVariable String notificationId, 
                                                 @RequestBody Map<String, Object> body, 
                                                 Authentication authentication) {
        try {
            String userId = getUserId(authentication);
            boolean accepted = Boolean.TRUE.equals(body.get("accepted"));

            Notification notif = notificationService.findById(notificationId);

            if (!notif.getUserId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("message", "Non autorisé"));
            }

            if (accepted) {
                String projectId = notif.getData().get("projectId");
                String role = notif.getData().get("role");

                Project project = projectService.findById(projectId);

                project.getMemberIds().add(userId);
                project.getMemberRoles().put(userId, role != null ? role : "MEMBER");
                projectRepository.save(project);

                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
                user.getProjectIds().add(projectId);
                userRepository.save(user);
            }

            notificationService.delete(notificationId);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /* =========================================
       UTILITAIRES
       ========================================= */

    private String getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return user.getId();
    }
}

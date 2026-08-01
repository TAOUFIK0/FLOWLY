package com.projet.collab.service;

import com.projet.collab.dto.request.ProjectRequest;
import com.projet.collab.exception.ResourceNotFoundException;
import com.projet.collab.model.Project;
import com.projet.collab.model.User;
import com.projet.collab.repository.ProjectRepository;
import com.projet.collab.repository.UserRepository;
import com.projet.collab.dto.MemberProgressDto;
import com.projet.collab.model.Task;
import com.projet.collab.repository.TaskRepository;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final AuditLogService auditLogService;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository; // AJOUTÉ

    // AJOUT DE taskRepository DANS LE CONSTRUCTEUR
    public ProjectService(ProjectRepository projectRepository,
                          AuditLogService auditLogService,
                          UserRepository userRepository,
                          TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.auditLogService = auditLogService;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository; // AJOUTÉ
    }

    public List<Project> findAll(String userId) {
        List<Project> owned = projectRepository.findByOwnerId(userId);
        List<Project> memberOf = projectRepository.findByMemberIdsContaining(userId);

        // Utilisation d'une LinkedHashMap pour fusionner et éviter les doublons d'ID
        Map<String, Project> uniqueProjects = new java.util.LinkedHashMap<>();
        
        for (Project p : owned) {
            uniqueProjects.put(p.getId(), p);
        }
        for (Project p : memberOf) {
            uniqueProjects.putIfAbsent(p.getId(), p); // Ne l'ajoute que s'il n'est pas déjà dans la liste
        }

        return new ArrayList<>(uniqueProjects.values());
    }

    public Project create(ProjectRequest request, String userId) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwnerId(userId);
        
        HashSet<String> members = new HashSet<>();
        members.add(userId);
        project.setMemberIds(members);

        // Le créateur devient OWNER du projet
        Map<String, String> roles = new HashMap<>();
        roles.put(userId, "OWNER");
        project.setMemberRoles(roles);

        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        project = projectRepository.save(project);
        auditLogService.log(userId, "CREATE", "PROJECT", project.getId());

        return project;
    }

    public Project findById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé : " + id));
    }

    /* Récupérer la liste des membres avec leurs rôles */
    public List<Map<String, Object>> getMembersWithRoles(String projectId, String currentUserId) {
        Project project = findById(projectId);
        List<Map<String, Object>> membersList = new ArrayList<>();

        for (String memberId : project.getMemberIds()) {
            Map<String, Object> memberData = new HashMap<>();
            
            // Récupérer les infos de l'utilisateur depuis la base
            User user = userRepository.findById(memberId).orElse(null);
            
            if (user != null) {
                memberData.put("userId", user.getId());
                memberData.put("name", user.getUsername()); 
                memberData.put("email", user.getEmail());
                memberData.put("isCurrentUser", user.getId().equals(currentUserId));
                
                // Récupérer le rôle depuis la Map (nouvelle logique)
                // Si le rôle n'est pas défini (anciens projets), on met MEMBER par défaut, sauf si c'est le propriétaire
                String role = project.getMemberRoles().get(memberId);
                if (role == null) {
                    role = project.getOwnerId().equals(memberId) ? "OWNER" : "MEMBER";
                }
                memberData.put("role", role);
                
                membersList.add(memberData);
            }
        }
        return membersList;
    }

    /* NOUVELLE FONCTION : Promouvoir ou rétrograder un membre */
    public void updateMemberRole(String projectId, String requesterId, String targetUserId, String newRole) {
        Project project = findById(projectId);

        // Seul le OWNER peut changer les rôles
        if (!project.getOwnerId().equals(requesterId)) {
            throw new RuntimeException("Seul le propriétaire du projet peut modifier les rôles.");
        }

        // On ne peut pas modifier le rôle du OWNER
        if (project.getOwnerId().equals(targetUserId)) {
            throw new RuntimeException("Impossible de modifier le rôle du propriétaire.");
        }

        // Le membre doit exister dans le projet
        if (!project.getMemberIds().contains(targetUserId)) {
            throw new RuntimeException("Cet utilisateur n'est pas membre du projet.");
        }

        // Valider le rôle (OWNER, MANAGER, MEMBER)
        if (!Arrays.asList("MANAGER", "MEMBER").contains(newRole)) {
            throw new RuntimeException("Rôle invalide.");
        }

        // Mettre à jour le rôle
        project.getMemberRoles().put(targetUserId, newRole);
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);
    }

    /* =========================================
       NOUVELLE FONCTION : TABLEAU DE BORD
       ========================================= */
        public List<MemberProgressDto> calculateMemberProgress(String projectId) {
        List<Task> projectTasks = taskRepository.findByProjectId(projectId);

        Map<String, List<Task>> tasksByMember = projectTasks.stream()
                .filter(t -> t.getAssigneeId() != null && !t.getAssigneeId().isEmpty())
                .collect(Collectors.groupingBy(Task::getAssigneeId));

        return tasksByMember.entrySet().stream().map(entry -> {
            String memberId = entry.getKey();
            List<Task> memberTasks = entry.getValue();

            long total = memberTasks.size();
            
            // ATTENTION : Vérifie que "DONE" correspond bien au statut terminé dans ton application
            long completed = memberTasks.stream()
                    .filter(t -> "DONE".equals(t.getStatus())) 
                    .count();
                    
            double percentage = total > 0 ? ((double) completed / total) * 100.0 : 0.0;

            User user = userRepository.findById(memberId).orElse(null);

            MemberProgressDto dto = new MemberProgressDto();
            dto.setUserId(memberId);
            
            if (user != null) {
                dto.setUsername(user.getUsername());
                dto.setAvatarUrl(null); // Mis à null car getAvatarUrl() n'existe pas dans ton modèle User
            } else {
                dto.setUsername("Utilisateur inconnu");
                dto.setAvatarUrl(null);
            }

            dto.setTotalTasks(total);
            dto.setCompletedTasks(completed);
            dto.setProgressPercentage(Math.round(percentage * 10.0) / 10.0); 

            return dto;
        })
        .sorted((a, b) -> Double.compare(b.getProgressPercentage(), a.getProgressPercentage()))
        .collect(Collectors.toList());
    }
}
   
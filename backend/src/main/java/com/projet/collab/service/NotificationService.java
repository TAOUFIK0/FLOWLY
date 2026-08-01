package com.projet.collab.service;

import com.projet.collab.model.Notification;
import com.projet.collab.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository,
                              SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /* =========================================
       MÉTHODES ORIGINALES (Tâches, etc.)
       ========================================= */

    public void notify(String userId, String message, String taskId, String projectId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setTaskId(taskId);
        notification.setProjectId(projectId);
        notification.setCreatedAt(LocalDateTime.now());
        
        notificationRepository.save(notification);
        sendViaWebSocket(userId, notification);
    }

    public List<Notification> getForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification notification : notifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(notifications);
    }

    /* =========================================
       NOUVELLES MÉTHODES (Invitations de projet)
       ========================================= */

    public Notification findById(String id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
    }

    public void delete(String id) {
        notificationRepository.deleteById(id);
    }

    public void sendInvitation(String targetUserId, String projectId, String projectName, String role, String notificationId) {
        Notification notification = new Notification();
        notification.setUserId(targetUserId);
        notification.setType("PROJECT_INVITE");
        notification.setMessage("Vous avez été invité au projet '" + projectName + "' en tant que " + role);
        notification.setProjectId(projectId);
        
        // On prépare les données spécifiques que le Frontend va utiliser pour le modal d'acceptation
        Map<String, String> data = new HashMap<>();
        data.put("id", notificationId); 
        data.put("projectId", projectId);
        data.put("role", role);
        data.put("projectName", projectName);
        notification.setData(data);
        notification.setId(notificationId);
        notificationRepository.save(notification);
        sendViaWebSocket(targetUserId, notification);
    }

    /* =========================================
       HELPER PRIVÉ
       ========================================= */

    private void sendViaWebSocket(String userId, Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notifications",
                    notification
            );
        } catch (Exception e) {
            // L'utilisateur n'est pas connecté en WebSocket, il verra la notification au prochain rechargement de page
        }
    }
}


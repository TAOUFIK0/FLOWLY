package com.projet.collab.controller;

import com.projet.collab.model.Notification;
import com.projet.collab.model.User;
import com.projet.collab.repository.UserRepository;
import com.projet.collab.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository; // AJOUT

    public NotificationController(NotificationService notificationService,
                                 UserRepository userRepository) { // AJOUT
        this.notificationService = notificationService;
        this.userRepository = userRepository; // AJOUT
    }

    @GetMapping
    public ResponseEntity<List<Notification>> findAll(Authentication authentication) {
        String userId = getUserId(authentication); // CORRECTION : on prend l'ID réel maintenant
        return ResponseEntity.ok(notificationService.getForUser(userId));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllRead(Authentication authentication) {
        String userId = getUserId(authentication); // CORRECTION
        notificationService.markAllRead(userId);
        return ResponseEntity.ok().build();
    }

    /* --- UTILITAIRE --- */
    private String getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return user.getId(); // On renvoie l'ID MongoDB (ex: 654a1b...) et plus l'email
    }
}


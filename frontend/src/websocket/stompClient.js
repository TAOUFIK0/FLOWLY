/* ========================================
   Client STOMP/SockJS — Notifications temps réel
   ======================================== */

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { store } from '../app/store';
import { addNotification } from '../features/notifications/notificationsSlice';

let stompClient = null;

/**
 * Connecte au serveur WebSocket via STOMP sur SockJS.
 *
 * ⚠️ Le token JWT est passé en QUERY PARAMètre et non en header.
 * SockJS utilise plusieurs transports (xhr, iframe, websocket) et seul
 * le transport websocket transmet les headers personnalisés.
 * Pour que Spring Security authentifie tous les transports, le token
 * doit être lu depuis le query param côté serveur.
 *
 * @see https://docs.spring.io/spring-framework/reference/web/websocket/fallback.html
 */
export function connectWebSocket(userId, token) {
  /* Éviter les doublons de connexion */
  if (stompClient?.active) {
    console.warn('[WebSocket] Connexion déjà active');
    return;
  }

  const wsUrl = import.meta.env.VITE_WS_URL || '/ws';

  stompClient = new Client({
    /* Factory SockJS : le token est injecté dans l'URL pour être accessible
       par tous les transports (websocket, xhr-streaming, xhr-polling…) */
    webSocketFactory: () => new SockJS(`${wsUrl}?token=${token}`),

    /* Reconnexion automatique après 5 secondes (délai fixe) */
    reconnectDelay: 5000,

    /* Heartbeat : keepalive bidirectionnel toutes les 10s */
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    /* Logs STOMP uniquement en développement */
    debug: (str) => {
      if (import.meta.env.DEV) {
        console.log('[STOMP]', str);
      }
    },

    /* ── Connexion établie ── */
    onConnect: (frame) => {
      console.log('[WebSocket] ✅ Connecté', frame);

      /* Abonnement aux notifications personnelles de l'utilisateur */
      stompClient.subscribe(
        `/user/${userId}/queue/notifications`,
        (message) => {
          try {
            const notification = JSON.parse(message.body);
            store.dispatch(addNotification(notification));
          } catch (error) {
            console.error('[WebSocket] Erreur de parsing notification:', error);
          }
        }
      );
    },

    /* ── Erreur de protocole STOMP ── */
    onStompError: (frame) => {
      console.error('[STOMP] ❌ Erreur protocole:', frame.headers['message']);
      console.error('[STOMP] Corps:', frame.body);
    },

    /* ── Fermeture WebSocket (code + raison) ── */
    onWebSocketClose: (evt) => {
      console.warn('[WebSocket] Connexion fermée — code:', evt.code, 'raison:', evt.reason);
    },

    /* ── Erreur WebSocket (réseau, CORS, etc.) ── */
    onWebSocketError: (evt) => {
      console.error('[WebSocket] ❌ Erreur transport:', evt);
    },
  });

  stompClient.activate();
}

/**
 * Déconnecte proprement le client STOMP.
 */
export function disconnectWebSocket() {
  if (stompClient?.active) {
    console.log('[WebSocket] Déconnexion en cours…');
    stompClient.deactivate();
  }
}

/**
 * Vérifie si la connexion STOMP est active.
 * @returns {boolean}
 */
export function isWebSocketConnected() {
  return stompClient?.active ?? false;
}

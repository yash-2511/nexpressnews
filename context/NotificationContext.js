import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, isFirebaseConfigured } from '../lib/firebaseConfig';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [permission, setPermission] = useState('default');
  const [token, setToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // Listen for foreground messages
    if (messaging && isFirebaseConfigured()) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        
        const notification = {
          id: Date.now(),
          title: payload.notification?.title || 'New Notification',
          body: payload.notification?.body || '',
          data: payload.data,
          timestamp: new Date().toISOString(),
        };
        
        setNotifications((prev) => [notification, ...prev]);
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.body,
            icon: '/placeholder.png',
            badge: '/placeholder.png',
          });
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      return { success: false, error: 'Notifications not supported in this browser' };
    }

    if (!isFirebaseConfigured() || !messaging) {
      return { 
        success: false, 
        error: 'Push notifications require Firebase configuration. Please set up Firebase credentials.' 
      };
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        // Get FCM token
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        
        if (!vapidKey) {
          console.warn('VAPID key not configured. Add NEXT_PUBLIC_FIREBASE_VAPID_KEY to .env.local');
        }

        const currentToken = await getToken(messaging, {
          vapidKey: vapidKey || undefined,
        });

        if (currentToken) {
          setToken(currentToken);
          console.log('FCM Token:', currentToken);
          
          // Store token in localStorage for later use
          localStorage.setItem('fcmToken', currentToken);
          
          return { success: true, token: currentToken };
        } else {
          return { success: false, error: 'No registration token available' };
        }
      } else {
        return { success: false, error: 'Notification permission denied' };
      }
    } catch (error) {
      console.error('Error getting notification permission:', error);
      return { success: false, error: error.message };
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        permission,
        token,
        notifications,
        isSupported,
        requestPermission,
        clearNotifications,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
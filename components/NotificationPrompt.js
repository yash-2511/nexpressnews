import { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

export default function NotificationPrompt() {
  const { permission, isSupported, requestPermission, notifications, removeNotification } = useNotification();
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show prompt if notifications are supported and permission is default
    if (isSupported && permission === 'default') {
      // Wait 3 seconds before showing prompt to not overwhelm user
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleEnableNotifications = async () => {
    setLoading(true);
    const result = await requestPermission();
    setLoading(false);
    
    if (result.success) {
      setShowPrompt(false);
    } else {
      alert(result.error || 'Failed to enable notifications');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember user dismissed, don't show again for 7 days
    localStorage.setItem('notificationPromptDismissed', Date.now().toString());
  };

  // Don't show if dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('notificationPromptDismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < weekInMs) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt || !isSupported || permission !== 'default') {
    return null;
  }

  return (
    <>
      {/* Notification Permission Prompt */}
      <div className="fixed bottom-4 right-4 max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700 z-50 animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-brandRed" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              ब्रेकिंग न्यूज़ की सूचना पाएं
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              महत्वपूर्ण खबरों की तुरंत जानकारी पाने के लिए नोटिफिकेशन चालू करें
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleEnableNotifications}
                disabled={loading}
                className="flex-1 bg-brandRed text-white text-xs py-2 px-3 rounded font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'लोड हो रहा है...' : 'चालू करें'}
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs py-2 px-3 rounded font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                बाद में
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast List */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 max-w-sm space-y-2 z-50">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-slide-down"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {notification.body}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

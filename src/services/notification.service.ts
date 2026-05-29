import api from './api';

export interface SecurityNotification {
  id: number;
  userId: string;
  type: 'security' | 'transaction' | 'system' | string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: SecurityNotification[];
  unreadCount: number;
}

const NotificationService = {
  async list(limit = 20) {
    const response = await api.get('/notifications', { params: { limit } });
    const data = response.data as NotificationListResponse;

    return {
      notifications: data.notifications || [],
      unreadCount: Number(data.unreadCount || 0),
    };
  },

  async markAsRead(notificationId: number | string) {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return {
      message: response.data?.message || 'Notification marquée comme lue.',
      unreadCount: Number(response.data?.unreadCount || 0),
    };
  },

  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all');
    return {
      message: response.data?.message || 'Toutes les notifications ont été marquées comme lues.',
      unreadCount: Number(response.data?.unreadCount || 0),
      updated: Number(response.data?.updated || 0),
    };
  },
};

export default NotificationService;

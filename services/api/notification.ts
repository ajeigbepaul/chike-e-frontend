import api from '../api';

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data.data.notifications;
};

export const markAsRead = async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
};

export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data.data.count;
};

const notificationService = { getNotifications, markAsRead, getUnreadCount };
export default notificationService; 
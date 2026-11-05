import api from '../api';

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data.data.notifications;
};

export const markAsRead = async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
};

export const getUnreadCount = async (type: 'order' | 'quote' = 'order') => {
  const response = await api.get(`/notifications/unread-count?type=${type}`);
  return response.data.data.count;
};

export const getUnreadByType = async (type: 'order' | 'quote') => {
  const response = await api.get(`/notifications/unread-count?type=${type}`);
  return response.data.data.count;
};

export const getUnreadQuoteIds = async (): Promise<string[]> => {
  const notifications = await getNotifications();
  return notifications
    .filter((notification: { type?: string; quote?: string | { _id?: string }; read?: boolean }) => {
      const quoteId =
        typeof notification.quote === 'string'
          ? notification.quote
          : notification.quote?._id;
      return notification.type === 'quote' && !notification.read && !!quoteId;
    })
    .map((notification: { quote?: string | { _id?: string } }) =>
      typeof notification.quote === 'string'
        ? notification.quote
        : notification.quote?._id
    )
    .filter((quoteId: string | undefined): quoteId is string => !!quoteId);
};

const notificationService = {
  getNotifications,
  markAsRead,
  getUnreadCount,
  getUnreadByType,
  getUnreadQuoteIds,
};
export default notificationService; 
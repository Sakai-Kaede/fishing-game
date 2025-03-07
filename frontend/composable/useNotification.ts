export interface Notification {
  id: number;
  message: string;
  level: number;
}

const notifications = ref<Notification[]>([]);

const addNotification = (message: string, level: number) => {
  const id = Date.now();
  notifications.value.push({
    id,
    message,
    level,
  });

  setTimeout(() => removeNotification(id), 20000);
};

const removeNotification = (id: number) => {
  notifications.value = notifications.value.filter(
    (notification) => notification.id !== id
  );
};

export const useNotification = () => {
  return {
    notifications,
    addNotification,
    removeNotification,
  };
};

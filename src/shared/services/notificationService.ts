import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const GetNotifications = ({ page }: any) => {
  return HTTP_CLIENT.get(
    Endpoint.notifications.getNotifications + `?page=${page}`
  );
};

const GetNotificationsCount = () => {
  return HTTP_CLIENT.get(Endpoint.notifications.notificationCount);
};

const ReadAllNotifications = () => {
  return HTTP_CLIENT.post(Endpoint.notifications.readAll);
};

const ReadNotification = (id: number) => {
  return HTTP_CLIENT.post(Endpoint.notifications.readSingle + id);
};

const AdjustNotificationPreference = (params: any) => {
  return HTTP_CLIENT.post(
    Endpoint.notifications.setNotificationsPreference,
    params
  );
};

const GetNotificationsPreferences = () => {
  return HTTP_CLIENT.get(Endpoint.notifications.getNotificationsPreference);
};

export {
  GetNotifications,
  GetNotificationsCount,
  ReadNotification,
  ReadAllNotifications,
  AdjustNotificationPreference,
  GetNotificationsPreferences,
};

import { useEffect, useState } from "react";
import { NotificationService } from "../../../services/NotificationService";
import * as Notifications from "expo-notifications";

export interface NotificationHookState {
  hasPermission: boolean;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
}

export function useNotifications(): NotificationHookState {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    initializeNotifications();
    setupNotificationHandlers();
  }, []);

  const initializeNotifications = async () => {
    setIsLoading(true);
    try {
      const success = await NotificationService.initialize();
      setHasPermission(success);
    } catch (error) {
      console.error("Failed to initialize notifications:", error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setupNotificationHandlers = () => {
    // Handle notification received while app is in foreground
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received in foreground:", notification);
      });

    // Handle notification tap/click
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;

        // Handle price alert notification tap
        if (data?.type === "price-alert" && data?.symbol) {
          // TODO: Navigate to specific stock details or watchlist
          console.log(`Navigate to ${data.symbol} details`);
        }
      });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  };

  const requestPermission = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await NotificationService.requestPermissions();
      setHasPermission(success);
      return success;
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hasPermission,
    isLoading,
    requestPermission,
  };
}

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configuration for notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const initializeNotifications = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Notification permission denied");
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("price-alerts", {
        name: "Stock Price Alerts",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
        enableVibrate: true,
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to initialize notification service:", error);
    return false;
  }
};

/**
 * Send a local notification for price alert
 */
export const sendPriceAlertNotification = async (
  symbol: string,
  currentPrice: number,
  targetPrice: number
): Promise<void> => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    console.warn("Cannot send notification: permission not granted");
    return;
  }

  try {
    const displaySymbol = symbol.includes(":") ? symbol.split(":")[1] : symbol;

    const title = `${displaySymbol} Alert Triggered!`;
    const body = `${displaySymbol} reached $${currentPrice.toFixed(
      2
    )} (target: $${targetPrice.toFixed(2)})`;
    const priceChangePercent = (
      ((currentPrice - targetPrice) / targetPrice) *
      100
    ).toFixed(1);

    const notificationId = `price-alert-${symbol}-${Date.now()}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: `${body} (+${priceChangePercent}%)`,
        sound: "default",
        priority: "high",
        data: {
          symbol,
          displaySymbol,
          currentPrice,
          targetPrice,
          priceChangePercent: parseFloat(priceChangePercent),
          type: "price-alert",
          timestamp: Date.now(),
        },
      },
      trigger: null,
      identifier: notificationId,
    });
  } catch (error) {
    console.error("Failed to send price alert notification:", error);
  }
};

/**
 * Cancel all pending notifications for a specific symbol
 */
export const cancelNotificationsForSymbol = async (
  symbol: string
): Promise<void> => {
  try {
    const pendingNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const symbolNotifications = pendingNotifications.filter(
      (notification) =>
        notification.content.data?.symbol === symbol &&
        notification.content.data?.type === "price-alert"
    );

    for (const notification of symbolNotifications) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  } catch (error) {
    console.error(`Failed to cancel notifications for ${symbol}:`, error);
  }
};

/**
 * Get permission status
 */
export const getNotificationPermissionStatus = async (): Promise<boolean> => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
};

/**
 * Re-request permissions if previously denied
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Failed to request notification permissions:", error);
    return false;
  }
};

export const NotificationService = {
  initialize: initializeNotifications,
  sendPriceAlertNotification,
  cancelNotificationsForSymbol,
  getPermissionStatus: getNotificationPermissionStatus,
  requestPermissions: requestNotificationPermissions,
} as const;

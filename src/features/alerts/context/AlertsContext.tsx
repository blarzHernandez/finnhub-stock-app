import React, { createContext, useContext, useEffect, useState } from "react";
import { AlertItem } from "../../../types";
import { loadJSON, saveJSON } from "../../../storage/persistent";
import { StorageKey } from "../../../storage/types";
import { NotificationService } from "../../../services/NotificationService";
const DEFAULT_COOLDOWN_DURATION_MS = 60 * 1000; // 1 minute in milliseconds
const INITIAL_ALERTS_STATE: AlertItem[] = [];

interface AlertsContextValue {
  alerts: AlertItem[];
  addAlert: (stockSymbol: string, targetPrice: number) => void;
  removeAlert: (alertId: string) => void;
  updateAlertLastTriggeredTime: (alertId: string, timestampMs: number) => void;
  clearAllAlerts: () => void;
}

interface AlertsProviderProps {
  children: React.ReactNode;
}

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined);

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const createNewAlert = (
  stockSymbol: string,
  targetPrice: number
): AlertItem => ({
  id: generateId(),
  symbol: stockSymbol,
  price: targetPrice,
  enabled: true,
  cooldownMilliseconds: DEFAULT_COOLDOWN_DURATION_MS,
});

const removeAlertById = (alerts: AlertItem[], alertId: string): AlertItem[] =>
  alerts.filter((alert) => alert.id !== alertId);

const updateAlertTimestamp = (
  alerts: AlertItem[],
  alertId: string,
  timestampMs: number
): AlertItem[] =>
  alerts.map((alert) =>
    alert.id === alertId ? { ...alert, lastTriggeredAt: timestampMs } : alert
  );

const loadAlertsFromStorage = async (): Promise<AlertItem[]> => {
  try {
    return await loadJSON<AlertItem[]>(StorageKey.Alerts, INITIAL_ALERTS_STATE);
  } catch (error) {
    console.error("Failed to load alerts from storage:", error);
    return INITIAL_ALERTS_STATE;
  }
};

const saveAlertsToStorage = async (alerts: AlertItem[]): Promise<void> => {
  try {
    await saveJSON(StorageKey.Alerts, alerts);
  } catch (error) {
    console.error("Failed to save alerts to storage:", error);
  }
};

export const AlertsProvider = ({ children }: AlertsProviderProps) => {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS_STATE);

  useEffect(() => {
    const initializeAlerts = async () => {
      const storedAlerts = await loadAlertsFromStorage();
      setAlerts(storedAlerts);
    };

    initializeAlerts();
  }, []);

  useEffect(() => {
    if (alerts.length > 0 || alerts !== INITIAL_ALERTS_STATE) {
      saveAlertsToStorage(alerts);
    }
  }, [alerts]);

  const addAlert = (stockSymbol: string, targetPrice: number): void => {
    try {
      const newAlert = createNewAlert(stockSymbol, targetPrice);
      setAlerts((currentAlerts) => {
        const updatedAlerts = [...currentAlerts, newAlert];
        return updatedAlerts;
      });
    } catch (error) {
      console.error("Error in addAlert:", error);
      throw error; // Re-throw so the form can catch it
    }
  };

  const removeAlert = (alertId: string): void => {
    const alertToRemove = alerts.find((alert) => alert.id === alertId);

    setAlerts((currentAlerts) => removeAlertById(currentAlerts, alertId));

    // Cancel any pending notifications for this symbol if it was the last alert for that symbol
    if (alertToRemove) {
      const remainingAlertsForSymbol = alerts.filter(
        (alert) => alert.symbol === alertToRemove.symbol && alert.id !== alertId
      );

      if (remainingAlertsForSymbol.length === 0) {
        NotificationService.cancelNotificationsForSymbol(
          alertToRemove.symbol
        ).catch((error) =>
          console.error("Failed to cancel notifications:", error)
        );
      }
    }
  };

  const updateAlertLastTriggeredTime = (
    alertId: string,
    timestampMs: number
  ): void => {
    setAlerts((currentAlerts) =>
      updateAlertTimestamp(currentAlerts, alertId, timestampMs)
    );
  };

  const clearAllAlerts = (): void => {
    // Cancel all pending price alert notifications
    alerts.forEach((alert) => {
      NotificationService.cancelNotificationsForSymbol(alert.symbol).catch(
        (error) => console.error("Failed to cancel notifications:", error)
      );
    });

    setAlerts(INITIAL_ALERTS_STATE);
  };

  const contextValue: AlertsContextValue = {
    alerts,
    addAlert,
    removeAlert,
    updateAlertLastTriggeredTime,
    clearAllAlerts,
  };

  return (
    <AlertsContext.Provider value={contextValue}>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = (): AlertsContextValue => {
  const contextValue = useContext(AlertsContext);

  if (contextValue === undefined) {
    throw new Error(
      "useAlerts must be used within an AlertsProvider. " +
        "Wrap your component tree with <AlertsProvider>."
    );
  }

  return contextValue;
};

import React, { createContext, useContext, useEffect, useState } from "react";
import { AlertItem } from "../../../types";
import { loadJSON, saveJSON } from "../../../storage/persistent";
import { StorageKey } from "../../../storage/types";
const DEFAULT_COOLDOWN_DURATION_MS = 60 * 1000; // 1 minute in milliseconds
const INITIAL_ALERTS_STATE: AlertItem[] = [];

interface AlertsContextValue {
  alerts: AlertItem[];
  addAlert: (stockSymbol: string, targetPrice: number) => void;
  removeAlert: (alertId: string) => void;
  updateAlertLastTriggeredTime: (alertId: string, timestampMs: number) => void;
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
    console.log("Adding alert for", stockSymbol, "at price", targetPrice);

    try {
      const newAlert = createNewAlert(stockSymbol, targetPrice);
      console.log("Created new alert:", newAlert);
      setAlerts((currentAlerts) => {
        const updatedAlerts = [...currentAlerts, newAlert];
        console.log("Updated alerts array:", updatedAlerts);
        return updatedAlerts;
      });
      console.log("Alert added successfully to context");
    } catch (error) {
      console.error("Error in addAlert:", error);
      throw error; // Re-throw so the form can catch it
    }
  };

  const removeAlert = (alertId: string): void => {
    setAlerts((currentAlerts) => removeAlertById(currentAlerts, alertId));
  };

  const updateAlertLastTriggeredTime = (
    alertId: string,
    timestampMs: number
  ): void => {
    setAlerts((currentAlerts) =>
      updateAlertTimestamp(currentAlerts, alertId, timestampMs)
    );
  };

  const contextValue: AlertsContextValue = {
    alerts,
    addAlert,
    removeAlert,
    updateAlertLastTriggeredTime,
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

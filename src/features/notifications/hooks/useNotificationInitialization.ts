import { useEffect } from "react";
import { NotificationService } from "../../../services/NotificationService";

export const useNotificationInitialization = () => {
  useEffect(() => {
    NotificationService.initialize().catch((error) => {
      console.error("Notification initialization failed:", error);
    });
  }, []);
};

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/features/auth/AuthProvider";
import { AlertsProvider } from "./src/features/alerts/context/AlertsContext";
import { useNotificationInitialization } from "./src/features/notifications/hooks/useNotificationInitialization";

export default function App() {
  // For initializing notification service on app startup
  useNotificationInitialization();

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <AlertsProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </AlertsProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

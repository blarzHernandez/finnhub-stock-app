import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/features/auth/AuthProvider";
import { AlertsProvider } from "./src/features/alerts/context/AlertsContext";

export default function App() {
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

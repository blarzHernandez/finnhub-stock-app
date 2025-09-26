
import { NavigationContainer } from "@react-navigation/native";
import { MainNavigator } from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import { useAuth } from "../features/auth/useAuth";

export function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

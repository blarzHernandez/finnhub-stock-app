
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import { useAuth } from "../features/auth/useAuth";
import { MainNavigator } from "./MainNavigator";

export const AppNavigator = () => {
    const { token } = useAuth();
  return (
    <NavigationContainer>
      {!token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

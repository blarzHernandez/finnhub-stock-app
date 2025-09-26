import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList, ScreenNames } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ScreenNames.Login} component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
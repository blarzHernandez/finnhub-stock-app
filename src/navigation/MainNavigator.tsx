import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList, ScreenNames } from "./types";
import { HomeScreen } from "../features/home/screens/HomeScreen";
import { WatchListScreen } from "../features/watchlist/screens/WatchListScreen";
import { AddAlertScreen } from "../features/alerts/screens/AddAlertScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={ScreenNames.Home} component={HomeScreen} />
      <Tab.Screen name={ScreenNames.Watchlist} component={WatchListScreen} />
      <Tab.Screen name={ScreenNames.AddAlert} component={AddAlertScreen} />
    </Tab.Navigator>
  );
};

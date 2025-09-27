import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../features/home/screens/HomeScreen";
import { ScreenNames } from "./types";
import { Ionicons } from "@expo/vector-icons";
import { AddAlertScreen } from "../features/alerts/screens/AddAlertScreen";
import { getTabBarIcon } from "../utils/tabBarIconUtil";
import { WatchlistScreen } from "../features/watchlist/screens/WatchListScreen";

const Tab = createBottomTabNavigator();

const DEFAULT_COLOR = "#007AFF";

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: DEFAULT_COLOR,
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabBarIcon(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name={ScreenNames.Home} component={HomeScreen} />
      <Tab.Screen name={ScreenNames.Watchlist} component={WatchlistScreen} />
      <Tab.Screen name={ScreenNames.AddAlert} component={AddAlertScreen} />
    </Tab.Navigator>
  );
};

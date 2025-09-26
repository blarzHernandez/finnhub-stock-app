import { Ionicons } from '@expo/vector-icons';
import { ScreenNames } from '../navigation/types';

export const getTabBarIcon = (
  routeName: string,
  focused: boolean
): keyof typeof Ionicons.glyphMap => {
  switch (routeName) {
    case ScreenNames.Home:
      return focused ? 'home' : 'home-outline';
    case ScreenNames.Watchlist:
      return focused ? 'list' : 'list-outline';
    case ScreenNames.AddAlert:
      return focused ? 'add-circle' : 'add-circle-outline';
    default:
      return 'ellipse';
  }
};
export const ScreenNames = {
  Login: "Login",
  Logout: "Logout",
  Home: "Home",
  Watchlist: "Watchlist",
  AddAlert: "AddAlert",
} as const;

export type AuthStackParamList = {
  [ScreenNames.Login]: undefined;
  [ScreenNames.Logout]: undefined;
};

export type MainTabParamList = {
  [ScreenNames.Home]: undefined;
  [ScreenNames.Watchlist]: undefined;
  [ScreenNames.AddAlert]: undefined;
};
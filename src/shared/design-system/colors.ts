/**
 * Centralized color palette following Material Design 3 guidelines
 */

export const Colors = {
  // Primary Brand Colors
  primary: {
    50: "#e8eaf6",
    100: "#c5cae9",
    200: "#9fa8da",
    300: "#7986cb",
    400: "#5c6bc0",
    500: "#3f51b5",
    600: "#3949ab",
    700: "#303f9f",
    800: "#283593",
    900: "#1a237e",
  },

  // Accent Colors
  accent: {
    50: "#fff3e0",
    100: "#ffe0b2",
    200: "#ffcc80",
    300: "#ffb74d",
    400: "#ffa726",
    500: "#ff9800",
    600: "#fb8c00",
    700: "#f57c00",
    800: "#ef6c00",
    900: "#e65100",
  },

  success: {
    50: "#e8f5e8",
    500: "#4caf50",
    700: "#388e3c",
  },

  warning: {
    50: "#fff8e1",
    500: "#ff9800",
    700: "#f57c00",
  },

  error: {
    50: "#ffebee",
    500: "#f44336",
    700: "#d32f2f",
  },

  neutral: {
    0: "#ffffff",
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    1000: "#000000",
  },

  surface: {
    background: "#ffffff",
    elevated: "#f8f9fa",
    overlay: "rgba(0, 0, 0, 0.5)",
  },

  gradients: {
    primary: ["#1a237e", "#3949ab", "#5c6bc0"],
    accent: ["#ff6b35", "#f7931e"],
    success: ["#66bb6a", "#4caf50"],
    sunset: ["#ff7f50", "#ff6347", "#ff4500"],
  },

  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#bdbdbd",
    inverse: "#ffffff",
    onPrimary: "#ffffff",
    onAccent: "#ffffff",
  },

  alpha: {
    white10: "rgba(255, 255, 255, 0.1)",
    white20: "rgba(255, 255, 255, 0.2)",
    white60: "rgba(255, 255, 255, 0.6)",
    white80: "rgba(255, 255, 255, 0.8)",
    black10: "rgba(0, 0, 0, 0.1)",
    black20: "rgba(0, 0, 0, 0.2)",
    black50: "rgba(0, 0, 0, 0.5)",
  },
} as const;

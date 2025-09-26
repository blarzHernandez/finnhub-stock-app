/**
 * Design System - Typography
 * Centralized typography scale following Material Design guidelines
 */

export const Typography = {
  // Font Families
  fontFamily: {
    primary: "System",
    monospace:
      'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
    "5xl": 40,
    "6xl": 48,
  },

  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    heavy: "800",
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  styles: {
    displayLarge: {
      fontSize: 48,
      fontWeight: "700",
      lineHeight: 1.2,
    },
    displayMedium: {
      fontSize: 40,
      fontWeight: "700",
      lineHeight: 1.2,
    },
    displaySmall: {
      fontSize: 32,
      fontWeight: "600",
      lineHeight: 1.25,
    },

    headlineLarge: {
      fontSize: 28,
      fontWeight: "600",
      lineHeight: 1.3,
    },
    headlineMedium: {
      fontSize: 24,
      fontWeight: "600",
      lineHeight: 1.3,
    },
    headlineSmall: {
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 1.4,
    },

    titleLarge: {
      fontSize: 18,
      fontWeight: "500",
      lineHeight: 1.4,
    },
    titleMedium: {
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 1.5,
    },
    titleSmall: {
      fontSize: 14,
      fontWeight: "500",
      lineHeight: 1.5,
    },

    bodyLarge: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 1.5,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 1.5,
    },

    labelLarge: {
      fontSize: 14,
      fontWeight: "500",
      lineHeight: 1.4,
    },
    labelMedium: {
      fontSize: 12,
      fontWeight: "500",
      lineHeight: 1.4,
    },
    labelSmall: {
      fontSize: 10,
      fontWeight: "500",
      lineHeight: 1.4,
    },

    button: {
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 1.2,
    },

    caption: {
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 1.4,
    },
  },
} as const;

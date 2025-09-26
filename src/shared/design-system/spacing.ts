/**
 * Design System - Spacing
 * Centralized spacing system using an 8px base unit
 */

export const Spacing = {
  // Base unit: 8px
  xs: 4, // 0.5 * base
  sm: 8, // 1 * base
  md: 16, // 2 * base
  lg: 24, // 3 * base
  xl: 32, // 4 * base
  "2xl": 40, // 5 * base
  "3xl": 48, // 6 * base
  "4xl": 56, // 7 * base
  "5xl": 64, // 8 * base

  // Semantic spacing
  component: {
    padding: 16,
    margin: 16,
    gap: 12,
  },

  screen: {
    horizontal: 32,
    vertical: 24,
  },

  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
  },

  card: {
    padding: 16,
    margin: 12,
    gap: 12,
  },
} as const;

/**
 * Border Radius System
 */
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,

  // Semantic border radius
  button: 16,
  card: 12,
  input: 8,
  avatar: 9999,
} as const;

/**
 * Shadow System
 */
export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },

  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.84,
    elevation: 5,
  },

  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
} as const;

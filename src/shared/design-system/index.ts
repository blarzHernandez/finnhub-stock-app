/**
 * Design System - Main Index
 * Central export for all design system tokens
 */

import { Colors } from "./colors";
import { Typography } from "./typography";
import { Spacing, BorderRadius, Shadows } from "./spacing";

export { Colors, Typography, Spacing, BorderRadius, Shadows };

// Design Tokens - Combined theme object
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
} as const;

// Type definitions for theme
export type ThemeColors = typeof Colors;
export type ThemeTypography = typeof Typography;
export type ThemeSpacing = typeof Spacing;
export type ThemeBorderRadius = typeof BorderRadius;
export type ThemeShadows = typeof Shadows;
export type ThemeType = typeof Theme;

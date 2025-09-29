import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../../shared/design-system";

interface FeaturedSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  testID?: string;
}

/**
 * Featured Section Wrapper Component
 */
export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  title,
  subtitle,
  children,
  testID = "featured-section",
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  content: {},
});

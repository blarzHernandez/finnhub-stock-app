import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaContainer } from "../../../shared/components/SafeAreaContainer";
import { useAuth } from "../../auth/AuthProvider";
import { Colors } from "../../../shared/design-system/colors";
import { Typography } from "../../../shared/design-system/typography";
import { Spacing } from "../../../shared/design-system/spacing";
import { useWebSocketManager } from "../../watchlist/hooks/useWebSocketManager";
import { usePortfolioData } from "../../graph";
import { FeaturedSection } from "../components/FeaturedSection";
import { PortfolioOverview } from "../components/PortfolioOverview";
import { TopMovers } from "../components/TopMovers";

export const HomeScreen = () => {
  const { signOut } = useAuth();
  const { stockQuotesList, isWebSocketConnected } = useWebSocketManager();

  // Initialize portfolio data tracking
  usePortfolioData(stockQuotesList);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <FeaturedSection
            title="Portfolio Overview"
            subtitle="Track your investments in real-time"
            testID="portfolio-section"
          >
            <PortfolioOverview />
          </FeaturedSection>
          <FeaturedSection
            title="Market Highlights"
            subtitle="Biggest movers in your watchlist"
            testID="top-movers-section"
          >
            <TopMovers stockQuotes={stockQuotesList} limit={5} />
          </FeaturedSection>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    marginTop: Spacing.md,
  },
  connectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  connectionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface.background,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  logoutButton: {
    backgroundColor: Colors.error[500],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: Colors.surface.background,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Typography.fontFamily.primary,
    textAlign: "center",
  },
});

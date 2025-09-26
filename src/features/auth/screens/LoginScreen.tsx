
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthProvider';
import { Theme, AuthCopy } from '../../../shared';
import { SafeAreaContainer } from '../../../shared/components/SafeAreaContainer';

const { width, height } = Dimensions.get('window');

export const LoginScreen = () => {
  const { signIn, isLoading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <SafeAreaContainer>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[900]} />

      {/* Background Gradient */}
      <LinearGradient
        colors={Theme.colors.gradients.primary}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="trending-up" size={Math.min(64, width * 0.15)} color="#ffffff" />
            </View>
            <Text style={styles.appTitle}>{AuthCopy.app.name}</Text>
            <Text style={styles.subtitle}>{AuthCopy.app.tagline}</Text>
          </View>

          {/* Content Section */}
          <View style={styles.content}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>{AuthCopy.login.welcome.title}</Text>
              <Text style={styles.welcomeText}>
                {AuthCopy.login.welcome.subtitle}
              </Text>
            </View>

            {/* Feature Highlights */}
            <View style={styles.featuresContainer}>
              <FeatureItem
                icon="notifications"
                text={AuthCopy.login.features.realTime}
              />
              <FeatureItem
                icon="analytics"
                text={AuthCopy.login.features.analytics}
              />
              <FeatureItem
                icon="shield-checkmark"
                text={AuthCopy.login.features.security}
              />
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottom}>
            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, isSigningIn && styles.signInButtonDisabled]}
              onPress={handleSignIn}
              disabled={isSigningIn || isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={Theme.colors.gradients.accent}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isSigningIn ? (
                  <ActivityIndicator color={Theme.colors.text.onAccent} size="small" />
                ) : (
                  <>
                    <Ionicons name="log-in" size={Math.min(20, width * 0.05)} color={Theme.colors.text.onAccent} style={styles.buttonIcon} />
                    <Text
                      style={styles.signInButtonText}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                    >
                      {AuthCopy.login.actions.signIn}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaContainer>
  );
};

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon as any} size={16} color={Theme.colors.accent[300]} />
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary[900],
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  header: {
    paddingTop: Theme.spacing['4xl'],
    paddingBottom: Theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
  },
  logoContainer: {
    width: Math.min(120, width * 0.25),
    height: Math.min(120, width * 0.25),
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.alpha.white10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    borderWidth: 2,
    borderColor: Theme.colors.alpha.white20,
  },
  appTitle: {
    fontSize: Math.min(28, width * 0.07), // Responsive font size
    fontWeight: '700',
    color: Theme.colors.text.inverse,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  subtitle: {
    fontSize: Math.min(16, width * 0.04),
    color: Theme.colors.alpha.white80,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.xl,
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: Theme.spacing.screen.horizontal,
    paddingVertical: Theme.spacing.xl,
  },
  welcomeSection: {
    marginBottom: Theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: Math.min(24, width * 0.06),
    fontWeight: '600',
    color: Theme.colors.text.inverse,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: Math.min(16, width * 0.04),
    color: Theme.colors.alpha.white80,
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresContainer: {
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  featureIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.alpha.white10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  featureText: {
    fontSize: 14,
    color: Theme.colors.alpha.white80,
    flex: 1,
    lineHeight: 20,
    fontWeight: '400',
  },
  bottom: {
    paddingHorizontal: Theme.spacing.screen.horizontal,
    paddingBottom: Theme.spacing.xl,
    paddingTop: Theme.spacing.lg,
  },
  signInButton: {
    borderRadius: Theme.borderRadius.button,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.lg,
    alignSelf: 'stretch',
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: Math.max(16, width * 0.04),
    borderRadius: Theme.borderRadius.button,
    minHeight: 56,
    flex: 1,
  },
  buttonIcon: {
    marginRight: 8,
  },
  signInButtonText: {
    fontSize: Math.min(16, width * 0.04),
    fontWeight: '600',
    color: Theme.colors.text.onAccent,
    textAlign: 'center',
    flexShrink: 1,
  },
  privacyText: {
    fontSize: 12,
    color: Theme.colors.alpha.white60,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Theme.spacing.md,
    flexWrap: 'wrap',
  },
});

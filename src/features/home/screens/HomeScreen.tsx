import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaContainer } from '../../../shared/components/SafeAreaContainer';
import { useAuth } from '../../auth/AuthProvider';
import { Colors } from '../../../shared/design-system/colors';
import { Typography } from '../../../shared/design-system/typography';
import { Spacing } from '../../../shared/design-system/spacing';

export const HomeScreen = () => {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text>
            Home Screen
          </Text>
        </View>
        <View style={styles.contentSection} />
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerSection: {
    flex: 0,
  },
  title: {
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    lineHeight: 24,
  },
  contentSection: {
    flex: 1,
  },
  buttonContainer: {
    paddingTop: Spacing.md,
  },
  logoutButton: {
    backgroundColor: Colors.error[500],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
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
    fontWeight: '600',
    fontFamily: Typography.fontFamily.primary,
    textAlign: 'center',
  },
});

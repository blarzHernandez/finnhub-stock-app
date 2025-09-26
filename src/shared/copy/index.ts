/**
 * Content Copy - Authentication
 * Centralized copy for semantic and maintainable text content
 */

export const AuthCopy = {
  // App Branding
  app: {
    name: "FinnHub Stock Alert",
    tagline: "Track your investments with confidence",
    description: "Real-time stock alerts and portfolio tracking made simple",
  },

  // Login Screen
  login: {
    welcome: {
      title: "Welcome Back",
      subtitle:
        "Sign in to access your personalized stock alerts and portfolio tracking",
    },

    features: {
      realTime: "Real-time stock alerts",
      analytics: "Advanced market analytics",
      security: "Secure authentication",
    },

    actions: {
      signIn: "Sign in with Auth0",
      signingIn: "Signing in...",
    },

    legal: {
      privacyNotice:
        "By signing in, you agree to our Terms of Service and Privacy Policy",
    },

    status: {
      checkingAuth: "Checking authentication...",
      authenticated: "✅ Authenticated",
      notAuthenticated: "❌ Not Authenticated",
      noToken: "No token",
    },
  },

  // Error Messages
  errors: {
    signInFailed: "Sign in failed. Please try again.",
    networkError: "Network error. Check your connection.",
    genericError: "Something went wrong. Please try again.",
    authRequired: "Authentication required to continue.",
  },

  // Success Messages
  success: {
    signInSuccess: "Successfully signed in!",
    signOutSuccess: "Successfully signed out!",
  },

  // Loading States
  loading: {
    authenticating: "Authenticating...",
    signingOut: "Signing out...",
    loading: "Loading...",
  },
} as const;

/**
 * Content Copy - General App
 */
export const AppCopy = {
  // Navigation
  navigation: {
    home: "Home",
    watchlist: "Watchlist",
    alerts: "Alerts",
    profile: "Profile",
    settings: "Settings",
  },

  // Common Actions
  actions: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
    confirm: "Confirm",
    retry: "Retry",
    refresh: "Refresh",
    back: "Back",
    next: "Next",
    done: "Done",
  },

  // Common States
  states: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    empty: "No data available",
    offline: "Offline",
    tryAgain: "Try again",
  },

  // Accessibility Labels
  a11y: {
    menu: "Open menu",
    close: "Close",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    refresh: "Refresh data",
    settings: "Open settings",
    profile: "Open profile",
  },
} as const;

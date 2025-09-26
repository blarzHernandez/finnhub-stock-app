import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../../features/auth/AuthProvider';

export const AuthStatus = () => {
    const { isAuthenticated, isLoading, token } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Checking authentication...</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                Authentication Status
            </Text>
            <Text style={{ marginTop: 10 }}>
                Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
            </Text>
            <Text style={{ marginTop: 5 }}>
                Token: {token ? `${token.substring(0, 20)}...` : 'No token'}
            </Text>
        </View>
    );
};
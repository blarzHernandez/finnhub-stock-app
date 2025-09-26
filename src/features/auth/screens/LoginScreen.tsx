
import React from 'react';
import { View, Button, Text } from 'react-native';
import { useAuth } from '../useAuth';

const SIGNIN_TEXT =  'Sign in with Auth0'

export const LoginScreen = () => {
  const { signIn } = useAuth();
  return (
    <View style={{flex:1, justifyContent:'center', padding:16}}>
      <Text style={{marginBottom:12}}>Sign in to continue</Text>
      <Button title={SIGNIN_TEXT} onPress={signIn} />
    </View>
  );
};

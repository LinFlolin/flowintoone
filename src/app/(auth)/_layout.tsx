import { Redirect, Stack } from 'expo-router'
import React from 'react'
import { useAuth } from '../provider/AuthProvider'

export  default  function AuthLayout() {
  const {isAuthenticated} = useAuth();
  if (isAuthenticated) return <Redirect href="/(protected)/(tabs)" />;

  return (
    <Stack >
        <Stack.Screen name='login' options={{ title:'Login', headerShown:false}}/>
        <Stack.Screen name='signup' options={{title:'Signup' }}/>
    </Stack>
  )
}

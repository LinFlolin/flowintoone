import { Redirect, Stack } from 'expo-router'
import React from 'react'
import { useAuth } from '../provider/AuthProvider'

export default function ProtectedLayout() {
 const {isAuthenticated} =useAuth()
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }
  return (
    <Stack>
        <Stack.Screen name='(tabs)' options={{headerShown:false}} />
    </Stack>
  )
}

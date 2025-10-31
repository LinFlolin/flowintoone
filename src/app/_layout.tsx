// app/_layout.tsx
import { Slot } from 'expo-router';
import React from 'react';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme, View } from 'react-native';
import "../../global.css"
import { AuthProvider } from '@/app/provider/AuthProvider';

export default function MainLayout() {
  const scheme = useColorScheme();
    const theme = scheme === "dark" ? DarkTheme : DefaultTheme;
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
       <AuthProvider>
        <ThemeProvider value={theme}>
          <Slot />
        </ThemeProvider>
      </AuthProvider>
    </View>
  );
}

import React, { useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as Font from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Outfit_400Regular': require('./assets/fonts/Outfit-Regular.ttf'),
          'Outfit_500Medium': require('./assets/fonts/Outfit-Medium.ttf'),
          'Outfit_700Bold': require('./assets/fonts/Outfit-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn("Font loading error:", e);
        // Fallback to system fonts if loading fails
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Or a very simple loading spinner if you prefer
  }

  return (
    <SafeAreaProvider >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});

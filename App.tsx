/**
 * Star System Sorter (S³)
 * Main App Component
 */

import React from 'react';
import {StatusBar, useColorScheme, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator, linking} from './src/navigation';
import {NavigationErrorBoundary} from './src/navigation/ErrorBoundary';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const handleNavigationError = (error: any) => {
    console.error('[Navigation Container Error]', error);
    Alert.alert(
      'Navigation Error',
      'An error occurred while navigating. Please try again.',
      [{text: 'OK'}],
    );
  };

  const handleErrorBoundaryReset = () => {
    // Reset to initial state if needed
    console.log('[Navigation] Error boundary reset');
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1a1a1a' : '#ffffff'}
      />
      <NavigationErrorBoundary onReset={handleErrorBoundaryReset}>
        <NavigationContainer
          linking={linking}
          onUnhandledAction={handleNavigationError}
          fallback={null}>
          <RootNavigator />
        </NavigationContainer>
      </NavigationErrorBoundary>
    </SafeAreaProvider>
  );
}

export default App;

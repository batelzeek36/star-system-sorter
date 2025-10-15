/**
 * Super Dash Screen
 * Flutter game integration
 * TODO: Implement in task 8.4
 */

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, BackHandler, ActivityIndicator} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {GameBridge, GameBridgeError} from '@/bridge';

type Props = ScreenProps<'SuperDash'>;

export function SuperDashScreen({navigation, route}: Props) {
  const {teamId, seed} = route.params;
  const [status, setStatus] = useState<'checking' | 'opening' | 'ready' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [readyVersion, setReadyVersion] = useState<string>('');

  useEffect(() => {
    console.log('[SuperDashScreen] Checking GameBridge availability...');
    
    // Check if GameBridge is available
    if (!GameBridge.isAvailable()) {
      console.log('[SuperDashScreen] GameBridge NOT available');
      setStatus('error');
      setErrorMessage('Game module not available. Flutter integration not enabled.');
      return;
    }

    console.log('[SuperDashScreen] GameBridge is available, attempting to open...');
    setStatus('opening');

    // Set up event listeners
    const unsubscribeReady = GameBridge.on('ready', (event) => {
      console.log('[SuperDashScreen] ✅ READY EVENT RECEIVED:', event);
      setReadyVersion(event.game_core_version);
      setStatus('ready');
      
      // Send START command after ready event
      console.log('[SuperDashScreen] Sending START command...');
      GameBridge.start({
        seed: seed,
        team: teamId,
        eventId: 'test-event-001', // TODO: Get from route params or generate
        musicEnabled: true,
      }).then(() => {
        console.log('[SuperDashScreen] ✅ START command sent successfully');
      }).catch((err) => {
        console.error('[SuperDashScreen] ❌ Failed to send START command:', err);
        setStatus('error');
        setErrorMessage(`Failed to start game: ${err.message}`);
      });
    });

    const unsubscribeError = GameBridge.on('error', (event) => {
      console.log('[SuperDashScreen] ❌ ERROR EVENT RECEIVED:', event);
      setStatus('error');
      setErrorMessage(`Game error: ${event.message} (${event.code})`);
    });

    const unsubscribeState = GameBridge.on('state', (event) => {
      console.log('[SuperDashScreen] 📊 STATE EVENT RECEIVED:', event);
    });

    // Try to open the game
    GameBridge.open()
      .then((readyEvent) => {
        console.log('[SuperDashScreen] ✅ Game opened successfully:', readyEvent);
      })
      .catch((err) => {
        console.error('[SuperDashScreen] ❌ Failed to open game:', err);
        if (err instanceof GameBridgeError) {
          setStatus('error');
          setErrorMessage(`${err.message} (${err.code})`);
        } else {
          setStatus('error');
          setErrorMessage('Unknown error opening game');
        }
      });

    // Cleanup
    return () => {
      console.log('[SuperDashScreen] Cleaning up...');
      unsubscribeReady();
      unsubscribeError();
      unsubscribeState();
      GameBridge.cleanup();
    };
  }, []);

  useEffect(() => {
    // Handle Android back button
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // TODO: Show pause modal on first press, quit on second press
        // For now, just navigate back
        navigation.goBack();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleMockGameComplete = () => {
    // Mock game result
    navigation.navigate('MatchResult', {
      score: 12450,
      validated: true,
      suspect: false,
      metrics: {
        distance: 5420,
        coins: 121,
        jumps: 87,
      },
    });
  };

  const handleRetry = () => {
    setStatus('checking');
    setErrorMessage('');
    // Re-trigger the effect by navigating away and back
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Super Dash Screen - Testing Bridge</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Team: {teamId}</Text>
        <Text style={styles.infoText}>Seed: {seed.substring(0, 8)}...</Text>
        <Text style={styles.infoText}>Status: {status}</Text>
        {readyVersion && <Text style={styles.infoText}>Game Version: {readyVersion}</Text>}
      </View>

      {status === 'checking' && (
        <View style={styles.statusCard}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.statusText}>Checking GameBridge...</Text>
        </View>
      )}

      {status === 'opening' && (
        <View style={styles.statusCard}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.statusText}>Opening Flutter game...</Text>
          <Text style={styles.statusSubtext}>Waiting for ready event...</Text>
        </View>
      )}

      {status === 'ready' && (
        <View style={styles.statusCard}>
          <Text style={styles.successText}>✅ Game Ready!</Text>
          <Text style={styles.statusSubtext}>Ready event received</Text>
          <Text style={styles.statusSubtext}>Check Metro logs for details</Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.statusCard}>
          <Text style={styles.errorText}>❌ Error</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            accessibilityLabel="Retry"
            accessibilityRole="button">
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.description}>
        Check Metro bundler logs for detailed event logging
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleMockGameComplete}
        accessibilityLabel="Complete Game (Mock)"
        accessibilityRole="button">
        <Text style={styles.buttonText}>Skip to Mock Result</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  placeholder: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  statusCard: {
    backgroundColor: '#1a1a1a',
    padding: 32,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  statusText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 16,
    fontWeight: '600',
  },
  statusSubtext: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 8,
    textAlign: 'center',
  },
  successText: {
    fontSize: 24,
    color: '#00ff00',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 24,
    color: '#ff0000',
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: 14,
    color: '#ff6666',
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
  },
  retryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

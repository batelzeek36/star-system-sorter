/**
 * Bridge Test Screen
 * 
 * Manual test screen for verifying bridge handshake.
 * Tests: Boot app → call GameBridge.open() → receive ready < 5s
 * 
 * Usage:
 * 1. Add this screen to your navigation
 * 2. Navigate to it
 * 3. Press "Test Handshake" button
 * 4. Verify results
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { GameBridge } from '../bridge/GameBridge';
import type { ReadyEvent, GameEvent } from '../bridge/types';

interface TestResult {
  success: boolean;
  message: string;
  elapsed?: number;
  event?: ReadyEvent;
  error?: string;
}

export function BridgeTestScreen() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);

  const runHandshakeTest = async () => {
    setTesting(true);
    setResult(null);
    setEvents([]);

    // Set up event listener
    const unsubscribe = GameBridge.onAny((event) => {
      setEvents((prev) => [...prev, event]);
    });

    try {
      // Check if native module is available
      if (!GameBridge.isAvailable()) {
        setResult({
          success: false,
          message: 'Native module not available',
          error: 'GameBridge native module not found. Ensure native bridges are implemented.',
        });
        return;
      }

      // Start timer
      const startTime = Date.now();

      // Open Flutter view and wait for ready event
      const readyEvent = await GameBridge.open();

      // Calculate elapsed time
      const elapsed = Date.now() - startTime;

      // Verify timing
      if (elapsed >= 5000) {
        setResult({
          success: false,
          message: `Ready event took too long: ${elapsed}ms`,
          elapsed,
          event: readyEvent,
        });
        return;
      }

      // Success!
      setResult({
        success: true,
        message: `✓ Handshake successful in ${elapsed}ms`,
        elapsed,
        event: readyEvent,
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Handshake failed',
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setTesting(false);
      unsubscribe();
    }
  };

  const sendTestCommand = async () => {
    try {
      await GameBridge.start({
        seed: '0123456789abcdef',
        team: 'test-team',
        eventId: 'test-event',
        musicEnabled: true,
      });
      
      setEvents((prev) => [
        ...prev,
        {
          type: 'state' as const,
          state: 'loading' as const,
          progress: 0,
        },
      ]);
    } catch (error) {
      console.error('Failed to send command:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bridge Handshake Test</Text>
        <Text style={styles.subtitle}>
          Tests: Boot → GameBridge.open() → ready &lt; 5s
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, testing && styles.buttonDisabled]}
          onPress={runHandshakeTest}
          disabled={testing}
        >
          {testing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Test Handshake</Text>
          )}
        </TouchableOpacity>

        {result && (
          <View
            style={[
              styles.resultBox,
              result.success ? styles.resultSuccess : styles.resultError,
            ]}
          >
            <Text style={styles.resultTitle}>
              {result.success ? '✓ Success' : '✗ Failed'}
            </Text>
            <Text style={styles.resultMessage}>{result.message}</Text>

            {result.elapsed && (
              <Text style={styles.resultDetail}>
                Elapsed: {result.elapsed}ms
              </Text>
            )}

            {result.event && (
              <View style={styles.eventBox}>
                <Text style={styles.eventTitle}>Ready Event:</Text>
                <Text style={styles.eventJson}>
                  {JSON.stringify(result.event, null, 2)}
                </Text>
              </View>
            )}

            {result.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorTitle}>Error:</Text>
                <Text style={styles.errorText}>{result.error}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Tests</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={sendTestCommand}
        >
          <Text style={styles.buttonText}>Send Start Command</Text>
        </TouchableOpacity>
      </View>

      {events.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Events Received ({events.length})</Text>
          <ScrollView style={styles.eventsContainer}>
            {events.map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <Text style={styles.eventType}>{event.type}</Text>
                <Text style={styles.eventJson}>
                  {JSON.stringify(event, null, 2)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification Checklist</Text>
        <View style={styles.checklist}>
          <Text style={styles.checklistItem}>
            ✓ Ready event received within 5 seconds
          </Text>
          <Text style={styles.checklistItem}>
            ✓ Event type is 'ready'
          </Text>
          <Text style={styles.checklistItem}>
            ✓ Event has game_core_version field
          </Text>
          <Text style={styles.checklistItem}>
            ✓ Event validates against Zod schema
          </Text>
          <Text style={styles.checklistItem}>
            ✓ Channel names match:
          </Text>
          <Text style={styles.checklistSubitem}>
            - Commands: s3/game/cmd
          </Text>
          <Text style={styles.checklistSubitem}>
            - Events: s3/game/events
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prerequisites</Text>
        <Text style={styles.prerequisite}>
          • Android/iOS native bridge implemented (Tasks 6.2/6.3)
        </Text>
        <Text style={styles.prerequisite}>
          • Flutter module built
        </Text>
        <Text style={styles.prerequisite}>
          • App running on device/simulator
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: '#5856D6',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBox: {
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  resultSuccess: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  resultError: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 16,
    marginBottom: 8,
  },
  resultDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventJson: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  errorBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 4,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#856404',
  },
  errorText: {
    fontSize: 12,
    color: '#856404',
  },
  eventsContainer: {
    maxHeight: 300,
  },
  eventItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    marginBottom: 8,
  },
  eventType: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#007AFF',
  },
  checklist: {
    paddingLeft: 8,
  },
  checklistItem: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  checklistSubitem: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 16,
    color: '#666',
  },
  prerequisite: {
    fontSize: 14,
    marginBottom: 6,
    color: '#666',
  },
});

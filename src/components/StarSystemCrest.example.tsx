/**
 * StarSystemCrests Usage Examples
 * 
 * Demonstrates how to use the individual crest components and lookup map
 */

import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  OrionCrest,
  SiriusCrest,
  PleiadesCrest,
  AndromedaCrest,
  LyraCrest,
  ArcturusCrest,
  StarSystemCrests,
} from './StarSystemCrests';

/**
 * Example 1: Using individual crest components directly
 */
export function DirectCrestExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Direct Crest Components</Text>
      <View style={styles.row}>
        <OrionCrest size={48} />
        <SiriusCrest size={48} />
        <PleiadesCrest size={48} />
      </View>
      <View style={styles.row}>
        <AndromedaCrest size={48} />
        <LyraCrest size={48} />
        <ArcturusCrest size={48} />
      </View>
    </View>
  );
}

/**
 * Example 2: Using the lookup map for dynamic rendering
 */
export function DynamicCrestExample() {
  const systems = ['Orion', 'Sirius', 'Pleiades', 'Andromeda', 'Lyra', 'Arcturus'] as const;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dynamic Crests from Map</Text>
      <View style={styles.grid}>
        {systems.map((system) => {
          const CrestComponent = StarSystemCrests[system];
          return (
            <View key={system} style={styles.crestItem}>
              <CrestComponent size={48} />
              <Text style={styles.label}>{system}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Example 3: Different sizes
 */
export function SizeVariantsExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Size Variants</Text>
      <View style={styles.row}>
        <View style={styles.crestItem}>
          <OrionCrest size={24} />
          <Text style={styles.label}>24px</Text>
        </View>
        <View style={styles.crestItem}>
          <OrionCrest size={28} />
          <Text style={styles.label}>28px</Text>
        </View>
        <View style={styles.crestItem}>
          <OrionCrest size={48} />
          <Text style={styles.label}>48px</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Example 4: Custom colors
 */
export function ColoredCrestsExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Colors</Text>
      <View style={styles.row}>
        <SiriusCrest size={48} color="#FFD700" />
        <PleiadesCrest size={48} color="#9B59B6" />
        <AndromedaCrest size={48} color="#3498DB" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  crestItem: {
    alignItems: 'center',
    margin: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: '#a0a0a0',
  },
});

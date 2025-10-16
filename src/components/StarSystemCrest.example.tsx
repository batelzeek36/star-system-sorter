/**
 * StarSystemCrest Usage Examples
 * 
 * This file demonstrates various ways to use the StarSystemCrest component.
 * Not included in production bundle.
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {StarSystemCrest} from './StarSystemCrest';

export function StarSystemCrestExamples() {
  return (
    <View style={styles.container}>
      {/* Basic usage with all known systems */}
      <View style={styles.row}>
        <StarSystemCrest system="Pleiades" />
        <StarSystemCrest system="Sirius" />
        <StarSystemCrest system="Arcturus" />
        <StarSystemCrest system="Andromeda" />
        <StarSystemCrest system="Orion" />
      </View>

      {/* Size variants */}
      <View style={styles.row}>
        <StarSystemCrest system="Pleiades" size="sm" />
        <StarSystemCrest system="Pleiades" size="md" />
        <StarSystemCrest system="Pleiades" size="lg" />
      </View>

      {/* Visual variants */}
      <View style={styles.row}>
        <StarSystemCrest system="Sirius" variant="default" />
        <StarSystemCrest system="Sirius" variant="outlined" />
      </View>

      {/* Custom color */}
      <View style={styles.row}>
        <StarSystemCrest system="Arcturus" color="#FF6B6B" />
        <StarSystemCrest system="Andromeda" color="#4ECDC4" />
      </View>

      {/* Fallback for unknown system */}
      <View style={styles.row}>
        <StarSystemCrest system="UnknownSystem" />
        <StarSystemCrest system="UnknownSystem" showFallbackText={true} />
      </View>

      {/* Combined variants */}
      <View style={styles.row}>
        <StarSystemCrest
          system="Orion"
          size="lg"
          variant="outlined"
          color="#9B59B6"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

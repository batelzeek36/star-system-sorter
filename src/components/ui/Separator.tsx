/**
 * Separator Component (React Native)
 * Adapted from shadcn/ui separator
 */

import React from 'react';
import {View, StyleSheet, type ViewProps} from 'react-native';
import {colors} from './theme';

export interface SeparatorProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({
  orientation = 'horizontal',
  style,
  ...props
}: SeparatorProps) {
  return (
    <View
      style={[
        styles.base,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.border,
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});

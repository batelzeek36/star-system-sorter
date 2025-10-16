/**
 * Card Component (React Native)
 * Based on Figma design system tokens
 */

import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

interface CardProps {
  variant?: 'default' | 'emphasis' | 'warning';
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export function Card({
  variant = 'default',
  children,
  style,
  testID,
}: CardProps) {
  const cardStyle: ViewStyle[] = [
    styles.base,
    styles[`variant_${variant}`],
    ...(style ? [style] : []),
  ];

  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 16,
    borderRadius: 24, // xl radius
    borderWidth: 1,
  },
  variant_default: {
    backgroundColor: 'rgba(91, 33, 182, 0.2)', // lavender-900 with opacity
    borderColor: 'rgba(167, 139, 250, 0.2)', // border-muted
  },
  variant_emphasis: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)', // lavender-600 with opacity
    borderColor: 'rgba(196, 181, 253, 0.4)', // lavender-400 with opacity
    shadowColor: '#8b5cf6',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  variant_warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)', // warning with opacity
    borderColor: 'rgba(251, 191, 36, 0.4)', // gold-400 with opacity
  },
});

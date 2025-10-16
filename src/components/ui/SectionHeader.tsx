/**
 * SectionHeader Component (React Native)
 * Based on Figma design system tokens
 */

import React from 'react';
import {View, Text, StyleSheet, TextStyle, ViewStyle} from 'react-native';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  style?: ViewStyle;
  testID?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  style,
  testID,
}: SectionHeaderProps) {
  const containerStyle: ViewStyle[] = [
    styles.container,
    ...(align === 'center' ? [styles.centerAlign] : []),
    ...(align === 'right' ? [styles.rightAlign] : []),
    ...(style ? [style] : []),
  ];

  const titleStyle: TextStyle[] = [
    styles.title,
    ...(align === 'center' ? [styles.centerText] : []),
    ...(align === 'right' ? [styles.rightText] : []),
  ];

  const subtitleStyle: TextStyle[] = [
    styles.subtitle,
    ...(align === 'center' ? [styles.centerText] : []),
    ...(align === 'right' ? [styles.rightText] : []),
  ];

  return (
    <View style={containerStyle} testID={testID}>
      <Text style={titleStyle} accessibilityRole="header">
        {title}
      </Text>
      {subtitle && (
        <Text style={subtitleStyle} accessibilityRole="text">
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  centerAlign: {
    alignItems: 'center',
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 36, // 4xl
    fontWeight: '700',
    color: '#ffffff', // text-primary
    lineHeight: 45, // 1.25 tight
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18, // lg
    fontWeight: '400',
    color: '#9ca3af', // text-muted
    lineHeight: 27, // 1.5 normal
  },
  centerText: {
    textAlign: 'center',
  },
  rightText: {
    textAlign: 'right',
  },
});

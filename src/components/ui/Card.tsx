/**
 * Card Component (React Native)
 * Adapted from shadcn/ui card with same API surface
 */

import React from 'react';
import {View, Text, StyleSheet, type ViewProps, type TextProps} from 'react-native';
import {colors, radius, spacing, fontSizes, fontWeights} from './theme';

export interface CardProps extends ViewProps {}

export function Card({style, ...props}: CardProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export interface CardHeaderProps extends ViewProps {}

export function CardHeader({style, ...props}: CardHeaderProps) {
  return <View style={[styles.header, style]} {...props} />;
}

export interface CardTitleProps extends TextProps {}

export function CardTitle({style, ...props}: CardTitleProps) {
  return <Text style={[styles.title, style]} {...props} />;
}

export interface CardDescriptionProps extends TextProps {}

export function CardDescription({style, ...props}: CardDescriptionProps) {
  return <Text style={[styles.description, style]} {...props} />;
}

export interface CardContentProps extends ViewProps {}

export function CardContent({style, ...props}: CardContentProps) {
  return <View style={[styles.content, style]} {...props} />;
}

export interface CardFooterProps extends ViewProps {}

export function CardFooter({style, ...props}: CardFooterProps) {
  return <View style={[styles.footer, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[6],
    gap: spacing[6],
  },
  header: {
    gap: spacing[2],
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.cardForeground,
    lineHeight: fontSizes.lg * 1.2,
  },
  description: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    lineHeight: fontSizes.sm * 1.5,
  },
  content: {
    gap: spacing[4],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});

/**
 * Toast Component
 * Adapted from Figma/components/s3/Toast.tsx for React Native
 * 
 * Toast notifications and InlineAlert components
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
  testID?: string;
}

export function Toast({ message, type = 'success', onClose, duration = 3000, testID }: ToastProps) {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.motion.duration.normal,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: theme.motion.duration.normal,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: theme.motion.duration.slow,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: theme.motion.duration.slow,
          useNativeDriver: true,
        }),
      ]).start(() => onClose());
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateY, onClose, duration, theme.motion.duration]);

  const config = {
    success: {
      icon: '✓',
      backgroundColor: theme.colors.semantic.success,
      textColor: theme.colors.text.primary,
    },
    error: {
      icon: '✕',
      backgroundColor: theme.colors.semantic.error,
      textColor: theme.colors.text.primary,
    },
    warning: {
      icon: '⚠',
      backgroundColor: theme.colors.semantic.warning,
      textColor: theme.colors.text.primary,
    },
    info: {
      icon: 'ℹ',
      backgroundColor: theme.colors.semantic.info,
      textColor: theme.colors.text.primary,
    },
  };

  const { icon, backgroundColor, textColor } = config[type];

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
          backgroundColor,
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          borderRadius: theme.borderRadius.full,
          ...theme.elevation[3],
        },
      ]}
    >
      <Text style={[styles.icon, { color: textColor, fontSize: theme.typography.fontSize.lg }]}>
        {icon}
      </Text>
      <Text
        style={[
          styles.message,
          {
            color: textColor,
            fontSize: theme.typography.fontSize.sm,
          },
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
}

interface InlineAlertProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  testID?: string;
}

export function InlineAlert({ message, type = 'info', onDismiss, testID }: InlineAlertProps) {
  const theme = useTheme();

  const config = {
    success: {
      icon: '✓',
      backgroundColor: `${theme.colors.semantic.success}1A`, // 10% opacity
      borderColor: theme.colors.semantic.success,
      textColor: '#6ee7b7', // green-300
    },
    error: {
      icon: '⚠',
      backgroundColor: `${theme.colors.semantic.error}1A`, // 10% opacity
      borderColor: theme.colors.semantic.error,
      textColor: '#fca5a5', // red-300
    },
    warning: {
      icon: '⚠',
      backgroundColor: `${theme.colors.semantic.warning}1A`, // 10% opacity
      borderColor: theme.colors.semantic.warning,
      textColor: theme.colors.gold[300],
    },
    info: {
      icon: 'ℹ',
      backgroundColor: `${theme.colors.semantic.info}1A`, // 10% opacity
      borderColor: theme.colors.semantic.info,
      textColor: '#93c5fd', // blue-300
    },
  };

  const { icon, backgroundColor, borderColor, textColor } = config[type];

  return (
    <View
      testID={testID}
      style={[
        styles.inlineContainer,
        {
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[3],
        },
      ]}
    >
      <Text style={[styles.inlineIcon, { color: textColor, fontSize: theme.typography.fontSize.sm }]}>
        {icon}
      </Text>
      <Text
        style={[
          styles.inlineMessage,
          {
            color: textColor,
            fontSize: theme.typography.fontSize.xs,
            lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.relaxed,
          },
        ]}
      >
        {message}
      </Text>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Dismiss alert"
          accessibilityRole="button"
        >
          <Text style={[styles.dismissIcon, { color: textColor, fontSize: theme.typography.fontSize.sm }]}>
            ✕
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 64,
    left: '50%',
    transform: [{ translateX: -100 }],
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 200,
  },
  icon: {
    flexShrink: 0,
  },
  message: {
    textAlign: 'center',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  inlineIcon: {
    flexShrink: 0,
  },
  inlineMessage: {
    flex: 1,
  },
  dismissIcon: {
    flexShrink: 0,
  },
});

/**
 * Toast Component
 * Adapted from Figma/components/s3/Toast.tsx for React Native
 * 
 * Toast notifications and InlineAlert components
 * Styled with NativeWind (Tailwind CSS utilities)
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, Platform } from 'react-native';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
  testID?: string;
}

export function Toast({ message, type = 'success', onClose, duration = 3000, testID }: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Fade in (200ms - motion.duration.normal)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss (300ms - motion.duration.slow)
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onClose());
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateY, onClose, duration]);

  const config = {
    success: {
      icon: '✓',
      bgClass: 'bg-semantic-success',
      textClass: 'text-text-primary',
    },
    error: {
      icon: '✕',
      bgClass: 'bg-semantic-error',
      textClass: 'text-text-primary',
    },
    warning: {
      icon: '⚠',
      bgClass: 'bg-semantic-warning',
      textClass: 'text-text-primary',
    },
    info: {
      icon: 'ℹ',
      bgClass: 'bg-semantic-info',
      textClass: 'text-text-primary',
    },
  };

  const { icon, bgClass, textClass } = config[type];

  // Platform-specific elevation (Android uses elevation prop, iOS uses shadow utilities)
  const elevationStyle = Platform.select({
    android: { elevation: 10 },
    ios: {},
  });

  return (
    <Animated.View
      testID={testID}
      className={`absolute top-16 left-1/2 z-[1000] flex-row items-center gap-3 min-w-[200px] px-4 py-3 rounded-full shadow-lg shadow-black/30 ${bgClass}`}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }, { translateX: -100 }],
        ...elevationStyle,
      }}
    >
      <Text className={`flex-shrink-0 text-lg ${textClass}`}>
        {icon}
      </Text>
      <Text className={`text-center text-sm ${textClass}`}>
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
  const config = {
    success: {
      icon: '✓',
      bgClass: 'bg-semantic-success/10',
      borderClass: 'border-semantic-success',
      textClass: 'text-green-300',
    },
    error: {
      icon: '⚠',
      bgClass: 'bg-semantic-error/10',
      borderClass: 'border-semantic-error',
      textClass: 'text-red-300',
    },
    warning: {
      icon: '⚠',
      bgClass: 'bg-semantic-warning/10',
      borderClass: 'border-semantic-warning',
      textClass: 'text-gold-300',
    },
    info: {
      icon: 'ℹ',
      bgClass: 'bg-semantic-info/10',
      borderClass: 'border-semantic-info',
      textClass: 'text-blue-300',
    },
  };

  const { icon, bgClass, borderClass, textClass } = config[type];

  return (
    <View
      testID={testID}
      className={`flex-row items-start gap-3 border rounded-2xl p-3 ${bgClass} ${borderClass}`}
    >
      <Text className={`flex-shrink-0 text-sm ${textClass}`}>
        {icon}
      </Text>
      <Text className={`flex-1 text-xs leading-relaxed ${textClass}`}>
        {message}
      </Text>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Dismiss alert"
          accessibilityRole="button"
        >
          <Text className={`flex-shrink-0 text-sm ${textClass}`}>
            ✕
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}



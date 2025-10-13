/**
 * Skeleton Component (React Native)
 * Adapted from shadcn/ui skeleton for loading states
 */

import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, type ViewProps} from 'react-native';
import {colors, radius} from './theme';

export interface SkeletonProps extends ViewProps {}

export function Skeleton({style, ...props}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.skeleton, {opacity}, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.muted,
    borderRadius: radius.md,
  },
});

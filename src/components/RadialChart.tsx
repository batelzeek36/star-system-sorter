/**
 * RadialChart Component
 * 
 * SVG-based radial progress chart with animation.
 * Displays percentage as a circular progress indicator.
 * 
 * Requirements: 1.3
 */

import React, {useEffect, useRef} from 'react';
import {View, Text, Animated} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
import {colors, spacing, typography} from '../theme/tokens';

export interface RadialChartProps {
  /** Percentage value (0-100) */
  percentage: number;
  /** Label text */
  label: string;
  /** Chart color */
  color: string;
  /** Chart size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * RadialChart
 * 
 * Renders a circular progress chart with animated fill.
 * Shows percentage value in the center with a label below.
 */
export function RadialChart({
  percentage,
  label,
  color,
  size = 120,
  strokeWidth = 8,
}: RadialChartProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Clamp percentage to 0-100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  useEffect(() => {
    // Animate from 0 to target percentage
    // Note: useNativeDriver must be false for SVG properties
    Animated.timing(animatedValue, {
      toValue: clampedPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [clampedPercentage, animatedValue]);
  
  // Calculate stroke dash offset for progress
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{alignItems: 'center'}} accessibilityLabel={`${label}: ${percentage.toFixed(1)}%`}>
      <View style={{position: 'relative', alignItems: 'center', justifyContent: 'center', width: size, height: size}}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            {/* Background circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.borders.muted}
              strokeWidth={strokeWidth}
              fill="none"
            />
            
            {/* Progress circle */}
            <AnimatedCircle
              cx={center}
              cy={center}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        
        {/* Center text */}
        <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center'}}>
          <Text 
            style={{
              color,
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
            }}>
            {clampedPercentage.toFixed(1)}%
          </Text>
        </View>
      </View>
      
      {/* Label */}
      <Text 
        style={{
          marginTop: spacing[2],
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.secondary,
          textAlign: 'center',
        }}>
        {label}
      </Text>
    </View>
  );
}

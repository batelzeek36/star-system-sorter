/**
 * Chip Component
 * Adapted from Figma/components/s3/Chip.tsx for React Native
 * 
 * Star system ally chips with percentages
 * Variants: gold, lavender
 * 
 * Migrated to NativeWind - uses className utilities
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

interface ChipProps {
  starSystem: string;
  percentage?: number;
  variant?: 'gold' | 'lavender';
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  testID?: string;
}

export function Chip({
  starSystem,
  percentage,
  variant = 'lavender',
  selectable = false,
  selected = false,
  onSelect,
  dismissible = false,
  onDismiss,
  testID,
}: ChipProps) {
  // Build className for container based on variant and selected state
  const getContainerClassName = () => {
    const base = 'flex-row items-center gap-2 px-3 py-1 rounded-full border';
    
    if (variant === 'gold') {
      if (selected) {
        return `${base} bg-gold-500 border-gold-400`;
      }
      return `${base} bg-gold-500/20 border-gold-400/40`;
    }
    
    // lavender variant (default)
    if (selected) {
      return `${base} bg-lavender-500 border-lavender-400`;
    }
    return `${base} bg-lavender-500/20 border-lavender-400/30`;
  };

  // Build className for text based on variant and selected state
  const getTextClassName = () => {
    const base = 'text-center text-xs font-medium';
    
    if (variant === 'gold') {
      return selected ? `${base} text-text-primary` : `${base} text-gold-300`;
    }
    
    // lavender variant (default)
    return selected ? `${base} text-text-primary` : `${base} text-lavender-300`;
  };

  const content = (
    <View
      className={`${getContainerClassName()} ${selectable ? 'min-h-11' : ''}`}
    >
      <Text className={getTextClassName()}>
        {starSystem} {percentage !== undefined && `${percentage}%`}
      </Text>
      {dismissible && onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          className="w-4 h-4 rounded-full items-center justify-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Dismiss ${starSystem}`}
          accessibilityRole="button"
        >
          <Text 
            className={`text-base ${variant === 'gold' ? (selected ? 'text-text-primary' : 'text-gold-300') : (selected ? 'text-text-primary' : 'text-lavender-300')}`}
            style={{ lineHeight: 16 }}
          >
            ×
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (selectable && onSelect) {
    return (
      <TouchableOpacity
        onPress={onSelect}
        activeOpacity={0.7}
        testID={testID}
        accessibilityLabel={`${starSystem}${percentage !== undefined ? ` ${percentage}%` : ''}`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View testID={testID}>{content}</View>;
}

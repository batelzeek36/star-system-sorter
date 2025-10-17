/**
 * Sheet Primitive Component (NativeWind)
 * 
 * Modal presentation component for React Native using Modal API.
 * Matches Figma/components/ui/sheet.tsx with React Native adaptations.
 * 
 * Design tokens from Figma/design-tokens.json:
 * - Background: canvas.dark (#0a0612)
 * - Overlay: bg-black/50 (50% opacity)
 * - Border radius: borderRadius.xl (24px) for top corners
 * - Elevation: elevation.4 (high elevation shadow)
 * - Animation: motion.duration.normal (200ms)
 * 
 * Usage:
 * <Sheet visible={isOpen} onClose={() => setIsOpen(false)}>
 *   <SheetHeader>
 *     <SheetTitle>Title</SheetTitle>
 *     <SheetDescription>Description</SheetDescription>
 *   </SheetHeader>
 *   <View>Content</View>
 * </Sheet>
 */

import React, { type ReactNode } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  Platform,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

interface SheetHeaderProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}

interface SheetTitleProps {
  children: ReactNode;
  className?: string;
  style?: TextStyle;
}

interface SheetDescriptionProps {
  children: ReactNode;
  className?: string;
  style?: TextStyle;
}

/**
 * Sheet root component
 * Modal presentation with overlay and content area
 * Default styling: bg-canvas-dark, rounded-t-3xl (24px), elevation-4
 */
export function Sheet({
  visible,
  onClose,
  children,
  className = '',
  style,
  testID,
}: SheetProps) {
  const baseClasses = 'bg-canvas-dark rounded-t-3xl flex-col';
  const combinedClassName = `${baseClasses} ${className}`.trim();

  // Platform-specific elevation (elevation.4 from design tokens)
  const platformStyle: ViewStyle = Platform.select({
    android: {
      elevation: 8,
      shadowColor: '#000000',
    },
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
    },
    default: {},
  }) as ViewStyle;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      testID={testID}
    >
      <View className="flex-1 justify-end">
        {/* Overlay with 50% opacity */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute inset-0 bg-black/50" />
        </TouchableWithoutFeedback>

        {/* Content area */}
        <TouchableWithoutFeedback>
          <View
            className={combinedClassName}
            style={[platformStyle, style]}
          >
            {children}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

/**
 * Sheet header section
 * Contains title and description with consistent spacing
 * Default styling: p-6 (24px padding), gap-1.5
 */
export function SheetHeader({ children, className = '', style }: SheetHeaderProps) {
  const baseClasses = 'flex flex-col gap-1.5 p-6';
  const combinedClassName = `${baseClasses} ${className}`.trim();

  return (
    <View className={combinedClassName} style={style}>
      {children}
    </View>
  );
}

/**
 * Sheet title text
 * Default styling: text-text-primary, font-semibold, text-xl
 */
export function SheetTitle({ children, className = '', style }: SheetTitleProps) {
  const baseClasses = 'text-text-primary font-semibold text-xl leading-tight';
  const combinedClassName = `${baseClasses} ${className}`.trim();

  return (
    <Text className={combinedClassName} style={style} accessibilityRole="header">
      {children}
    </Text>
  );
}

/**
 * Sheet description text
 * Default styling: text-text-muted, text-sm
 */
export function SheetDescription({ children, className = '', style }: SheetDescriptionProps) {
  const baseClasses = 'text-text-muted text-sm leading-normal';
  const combinedClassName = `${baseClasses} ${className}`.trim();

  return (
    <Text className={combinedClassName} style={style} accessibilityRole="text">
      {children}
    </Text>
  );
}

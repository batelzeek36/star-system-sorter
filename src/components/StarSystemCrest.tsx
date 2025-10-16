/**
 * StarSystemCrest Component
 * 
 * Renders SVG crest for each star system with size and variant options.
 * Uses react-native-svg for cross-platform rendering.
 * Provides fallback for unknown/missing star systems.
 * 
 * Requirements: 1.3, 1.15
 */

import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Svg, {Circle, Path, Polygon, G, Ellipse} from 'react-native-svg';

export type StarSystemName =
  | 'Pleiades'
  | 'Sirius'
  | 'Arcturus'
  | 'Andromeda'
  | 'Orion';

export type CrestSize = 'sm' | 'md' | 'lg';
export type CrestVariant = 'default' | 'outlined';

export interface StarSystemCrestProps {
  /** Star system name */
  system: StarSystemName | string;
  /** Size variant */
  size?: CrestSize;
  /** Visual variant */
  variant?: CrestVariant;
  /** Optional color override */
  color?: string;
  /** Show fallback text for unknown systems */
  showFallbackText?: boolean;
}

const SIZE_MAP: Record<CrestSize, number> = {
  sm: 48,
  md: 80,
  lg: 120,
};

const SYSTEM_COLORS: Record<string, string> = {
  Pleiades: '#4A90E2',
  Sirius: '#50E3C2',
  Arcturus: '#F5A623',
  Andromeda: '#BD10E0',
  Orion: '#D0021B',
};

const FALLBACK_COLOR = '#9CA3AF';

/**
 * StarSystemCrest
 * 
 * Displays a geometric crest representing a star system.
 * Each system has a unique geometric pattern.
 * Shows fallback for unknown systems.
 */
export function StarSystemCrest({
  system,
  size = 'md',
  variant = 'default',
  color,
  showFallbackText = false,
}: StarSystemCrestProps) {
  const dimension = SIZE_MAP[size];
  const isKnownSystem = system in SYSTEM_COLORS;
  const systemColor = color || SYSTEM_COLORS[system] || FALLBACK_COLOR;
  const strokeWidth = variant === 'outlined' ? 2 : 0;
  const fillOpacity = variant === 'outlined' ? 0 : 1;

  return (
    <View
      style={[styles.container, {width: dimension, height: dimension}]}
      accessibilityLabel={`${system} crest`}
      accessibilityRole="image">
      <Svg width={dimension} height={dimension} viewBox="0 0 100 100">
        {renderCrest(system, systemColor, strokeWidth, fillOpacity, isKnownSystem)}
      </Svg>
      {!isKnownSystem && showFallbackText && (
        <Text style={[styles.fallbackText, {fontSize: dimension * 0.12}]}>
          {system}
        </Text>
      )}
    </View>
  );
}

function renderCrest(
  system: string,
  color: string,
  strokeWidth: number,
  fillOpacity: number,
  isKnownSystem: boolean,
): React.ReactNode {
  const fill = fillOpacity > 0 ? color : 'none';
  const stroke = strokeWidth > 0 ? color : 'none';

  switch (system) {
    case 'Pleiades':
      // Seven-pointed star cluster (Seven Sisters)
      return (
        <G>
          <Circle cx="50" cy="50" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="50" cy="30" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="70" cy="40" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="70" cy="60" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="50" cy="70" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="30" cy="60" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="30" cy="40" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="60" cy="50" r="5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </G>
      );

    case 'Sirius':
      // Bright diamond star (brightest star in night sky)
      return (
        <G>
          <Polygon
            points="50,10 70,50 50,90 30,50"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <Circle cx="50" cy="50" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </G>
      );

    case 'Arcturus':
      // Triangular constellation with central energy
      return (
        <G>
          <Polygon
            points="50,20 80,70 20,70"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <Circle cx="50" cy="50" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="50" cy="20" r="4" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="80" cy="70" r="4" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="20" cy="70" r="4" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </G>
      );

    case 'Andromeda':
      // Spiral galaxy pattern
      return (
        <G>
          <Ellipse
            cx="50"
            cy="50"
            rx="35"
            ry="20"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <Ellipse
            cx="50"
            cy="50"
            rx="25"
            ry="15"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <Circle cx="50" cy="50" r="10" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </G>
      );

    case 'Orion':
      // Belt and sword pattern (Orion's Belt constellation)
      return (
        <G>
          {/* Belt - three stars in a row */}
          <Circle cx="35" cy="40" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="50" cy="40" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="65" cy="40" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          {/* Sword - vertical line below belt */}
          <Circle cx="50" cy="55" r="5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="50" cy="70" r="7" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </G>
      );

    default:
      // Fallback: generic star pattern for unknown systems
      return (
        <G>
          <Circle
            cx="50"
            cy="50"
            r="25"
            fill={fill}
            stroke={stroke || color}
            strokeWidth={strokeWidth || 2}
            opacity={0.5}
          />
          <Polygon
            points="50,20 55,45 80,45 60,60 65,85 50,70 35,85 40,60 20,45 45,45"
            fill={fill}
            stroke={stroke || color}
            strokeWidth={strokeWidth || 1}
            opacity={0.7}
          />
        </G>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fallbackText: {
    position: 'absolute',
    bottom: -20,
    color: FALLBACK_COLOR,
    textAlign: 'center',
    fontWeight: '500',
  },
});

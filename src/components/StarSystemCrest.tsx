/**
 * StarSystemCrest Component
 * 
 * Renders SVG crest for each star system with size and variant options.
 * Uses react-native-svg for cross-platform rendering.
 * 
 * Requirements: 1.3, 1.15
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle, Path, Polygon, G} from 'react-native-svg';

export type StarSystemName =
  | 'Pleiades'
  | 'Sirius'
  | 'Arcturus'
  | 'Andromeda'
  | 'Lyra'
  | 'Orion';

export type CrestSize = 'sm' | 'md' | 'lg';
export type CrestVariant = 'default' | 'outlined';

export interface StarSystemCrestProps {
  /** Star system name */
  system: StarSystemName;
  /** Size variant */
  size?: CrestSize;
  /** Visual variant */
  variant?: CrestVariant;
  /** Optional color override */
  color?: string;
}

const SIZE_MAP: Record<CrestSize, number> = {
  sm: 48,
  md: 80,
  lg: 120,
};

const SYSTEM_COLORS: Record<StarSystemName, string> = {
  Pleiades: '#4A90E2',
  Sirius: '#50E3C2',
  Arcturus: '#F5A623',
  Andromeda: '#BD10E0',
  Lyra: '#7ED321',
  Orion: '#D0021B',
};

/**
 * StarSystemCrest
 * 
 * Displays a geometric crest representing a star system.
 * Each system has a unique geometric pattern.
 */
export function StarSystemCrest({
  system,
  size = 'md',
  variant = 'default',
  color,
}: StarSystemCrestProps) {
  const dimension = SIZE_MAP[size];
  const systemColor = color || SYSTEM_COLORS[system];
  const strokeWidth = variant === 'outlined' ? 2 : 0;
  const fillOpacity = variant === 'outlined' ? 0 : 1;

  return (
    <View
      style={[styles.container, {width: dimension, height: dimension}]}
      accessibilityLabel={`${system} crest`}
      accessibilityRole="image">
      <Svg width={dimension} height={dimension} viewBox="0 0 100 100">
        {renderCrest(system, systemColor, strokeWidth, fillOpacity)}
      </Svg>
    </View>
  );
}

function renderCrest(
  system: StarSystemName,
  color: string,
  strokeWidth: number,
  fillOpacity: number,
): React.ReactNode {
  const fill = fillOpacity > 0 ? color : 'none';
  const stroke = strokeWidth > 0 ? color : 'none';

  switch (system) {
    case 'Pleiades':
      // Seven-pointed star cluster
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
      // Bright diamond star
      return (
        <Polygon
          points="50,10 70,50 50,90 30,50"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case 'Arcturus':
      // Triangular constellation
      return (
        <G>
          <Polygon
            points="50,20 80,70 20,70"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <Circle cx="50" cy="50" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </G>
      );

    case 'Andromeda':
      // Spiral galaxy pattern
      return (
        <G>
          <Path
            d="M 50 20 Q 70 30 70 50 Q 70 70 50 80 Q 30 70 30 50 Q 30 30 50 20"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <Circle cx="50" cy="50" r="10" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </G>
      );

    case 'Lyra':
      // Harp/lyre shape
      return (
        <G>
          <Path
            d="M 30 80 L 30 30 Q 50 20 70 30 L 70 80"
            fill="none"
            stroke={stroke || color}
            strokeWidth={strokeWidth || 3}
          />
          <Circle cx="30" cy="80" r="5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="70" cy="80" r="5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </G>
      );

    case 'Orion':
      // Belt and sword pattern
      return (
        <G>
          <Circle cx="35" cy="30" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="50" cy="30" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="65" cy="30" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="50" cy="50" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx="50" cy="70" r="6" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </G>
      );

    default:
      // Fallback: simple circle
      return (
        <Circle
          cx="50"
          cy="50"
          r="30"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

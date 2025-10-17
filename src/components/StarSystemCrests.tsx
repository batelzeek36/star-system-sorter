/**
 * Star System Crests
 * Adapted from Figma/components/s3/StarSystemCrests.tsx for React Native
 * 
 * Geometric crest icons for each star system
 * Export sizes: 24px, 28px, 48px
 * 
 * Supports theming via color prop - defaults to lavender primary color
 */

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/tokens';

interface CrestProps {
  size?: 24 | 28 | 48;
  color?: string;
  testID?: string;
}

// Default theme color (lavender primary)
const DEFAULT_COLOR = colors.lavender[500];

export function OrionCrest({ size = 24, color = DEFAULT_COLOR, testID }: CrestProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" testID={testID}>
      {/* Three aligned stars forming Orion's belt */}
      <Circle cx="24" cy="24" r="3" fill={color} />
      <Circle cx="14" cy="20" r="2.5" fill={color} opacity="0.8" />
      <Circle cx="34" cy="28" r="2.5" fill={color} opacity="0.8" />
      <Path
        d="M24 8 L24 18 M24 30 L24 40 M8 24 L18 24 M30 24 L40 24"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.3"
      />
    </Svg>
  );
}

export function SiriusCrest({ size = 24, color = DEFAULT_COLOR, testID }: CrestProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" testID={testID}>
      {/* Bright central star with eight-pointed rays */}
      <Circle cx="24" cy="24" r="4" fill={color} />
      <Path
        d="M24 10 L24 16 M24 32 L24 38 M10 24 L16 24 M32 24 L38 24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M15 15 L19 19 M29 29 L33 33 M33 15 L29 19 M19 29 L15 33"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PleiadesCrest({ size = 24, color = DEFAULT_COLOR, testID }: CrestProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" testID={testID}>
      {/* Seven sisters - cluster of seven stars */}
      <Circle cx="24" cy="20" r="2.5" fill={color} />
      <Circle cx="18" cy="24" r="2" fill={color} opacity="0.9" />
      <Circle cx="30" cy="24" r="2" fill={color} opacity="0.9" />
      <Circle cx="20" cy="30" r="2" fill={color} opacity="0.8" />
      <Circle cx="28" cy="30" r="2" fill={color} opacity="0.8" />
      <Circle cx="16" cy="16" r="1.8" fill={color} opacity="0.7" />
      <Circle cx="32" cy="16" r="1.8" fill={color} opacity="0.7" />
      <Path
        d="M24 20 L18 24 L20 30 L24 20 L30 24 L28 30 Z"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.2"
        fill="none"
      />
    </Svg>
  );
}

export function AndromedaCrest({ size = 24, color = DEFAULT_COLOR, testID }: CrestProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" testID={testID}>
      {/* Spiral galaxy representation */}
      <Circle cx="24" cy="24" r="3" fill={color} />
      <Path
        d="M24 24 Q 32 20, 36 24 Q 32 28, 24 24"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <Path
        d="M24 24 Q 20 16, 24 12 Q 28 16, 24 24"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <Path
        d="M24 24 Q 16 28, 12 24 Q 16 20, 24 24"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <Path
        d="M24 24 Q 28 32, 24 36 Q 20 32, 24 24"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </Svg>
  );
}

export function LyraCrest({ size = 24, color = DEFAULT_COLOR, testID }: CrestProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" testID={testID}>
      {/* Lyre/Harp shape with bright Vega star */}
      <Circle cx="24" cy="16" r="3" fill={color} />
      <Path d="M16 14 Q 24 8, 32 14" stroke={color} strokeWidth="1.5" fill="none" />
      <Path d="M16 14 L16 32 M32 14 L32 32" stroke={color} strokeWidth="1.5" />
      <Path d="M16 32 Q 24 36, 32 32" stroke={color} strokeWidth="1.5" fill="none" />
      <Path
        d="M18 20 L30 20 M18 24 L30 24 M18 28 L30 28"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.4"
      />
    </Svg>
  );
}

export function ArcturusCrest({ size = 24, color = DEFAULT_COLOR, testID }: CrestProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" testID={testID}>
      {/* Guardian/Ancient symbol - triangle with center point */}
      <Circle cx="24" cy="24" r="3.5" fill={color} />
      <Path d="M24 10 L38 34 L10 34 Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <Circle cx="24" cy="10" r="1.5" fill={color} opacity="0.7" />
      <Circle cx="38" cy="34" r="1.5" fill={color} opacity="0.7" />
      <Circle cx="10" cy="34" r="1.5" fill={color} opacity="0.7" />
    </Svg>
  );
}

// Map for easy lookup
export const StarSystemCrests = {
  Orion: OrionCrest,
  Osirian: OrionCrest, // Alias
  Sirius: SiriusCrest,
  Pleiades: PleiadesCrest,
  Andromeda: AndromedaCrest,
  Lyra: LyraCrest,
  Arcturus: ArcturusCrest,
};

export type StarSystemName = keyof typeof StarSystemCrests;

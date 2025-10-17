/**
 * Clock Icon
 * SVG icon for time input fields
 */

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface ClockIconProps {
  size?: number;
  color?: string;
}

export function ClockIcon({ size = 20, color = 'currentColor' }: ClockIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 6v6l4 2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

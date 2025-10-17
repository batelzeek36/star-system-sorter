/**
 * Shield Icon Component
 * SVG shield icon for privacy/security settings
 */

import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface ShieldIconProps {
  size?: number;
  color?: string;
}

export function ShieldIcon({size = 24, color = 'currentColor'}: ShieldIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

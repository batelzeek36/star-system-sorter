/**
 * Empty State Icons
 * Simple icon components for empty states and error messages
 */

import React from 'react';
import Svg, { Path, Circle, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function SparklesIcon({ size = 32, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"
        fill={color}
      />
      <Path
        d="M19 3L19.5 5.5L22 6L19.5 6.5L19 9L18.5 6.5L16 6L18.5 5.5L19 3Z"
        fill={color}
      />
      <Path
        d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z"
        fill={color}
      />
    </Svg>
  );
}

export function AlertTriangleIcon({ size = 32, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <Line x1="12" y1="9" x2="12" y2="13" />
      <Circle cx="12" cy="17" r="0.5" fill={color} />
    </Svg>
  );
}

export function WifiOffIcon({ size = 32, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Line x1="2" y1="2" x2="22" y2="22" />
      <Path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <Path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
      <Path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
      <Path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
      <Path d="M5 13a10 10 0 0 1 5.24-2.76" />
      <Circle cx="12" cy="20" r="1" fill={color} />
    </Svg>
  );
}

export function FileQuestionIcon({ size = 32, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Path d="M14 2v6h6" />
      <Path d="M9.5 15a2.5 2.5 0 0 1 2.5-2.5c1.38 0 2.5 1.12 2.5 2.5 0 .84-.42 1.58-1.06 2.03L12 18" />
      <Circle cx="12" cy="20" r="0.5" fill={color} />
    </Svg>
  );
}

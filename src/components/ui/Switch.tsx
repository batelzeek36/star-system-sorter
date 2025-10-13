/**
 * Switch Component (React Native)
 * Adapted from shadcn/ui switch
 */

import React from 'react';
import {Switch as RNSwitch, type SwitchProps as RNSwitchProps} from 'react-native';
import {colors} from './theme';

export interface SwitchProps extends RNSwitchProps {}

export function Switch({...props}: SwitchProps) {
  return (
    <RNSwitch
      trackColor={{
        false: colors.muted,
        true: colors.primary,
      }}
      thumbColor={colors.background}
      ios_backgroundColor={colors.muted}
      {...props}
    />
  );
}

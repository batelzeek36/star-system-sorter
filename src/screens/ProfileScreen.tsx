/**
 * Profile Screen (06_Profile from Figma - Simplified)
 * 
 * Displays user profile with:
 * - User type display (e.g., "Manifesting Generator • 1/3")
 * - Star system profile cards (Primary + Allies)
 * - Settings icon → Settings screen
 * 
 * Requirements: 1.7, 1.10
 * Task: 2.2.5
 * 
 * Migrated to NativeWind (Task 7.1)
 */

import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {StarSystemCrest, type StarSystemName} from '@/components';
import {Card} from '@/ui/Card';
import {SettingsIcon} from '@/components/icons';
import {StarfieldBackground} from '@/components/StarfieldBackground';

type Props = ScreenProps<'Profile'>;

// Mock data - in real app, this would come from state/API
const MOCK_USER_DATA = {
  hdType: 'Manifesting Generator',
  profile: '1/3',
  primarySystem: 'Pleiades' as StarSystemName,
  primaryPercentage: 62,
  allies: [
    {system: 'Sirius' as StarSystemName, percentage: 18},
    {system: 'Arcturus' as StarSystemName, percentage: 12},
    {system: 'Andromeda' as StarSystemName, percentage: 8},
  ],
};

export function ProfileScreen({navigation}: Props) {
  const handleGoToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View className="flex-1 bg-canvas-dark">
      <StarfieldBackground />
      
      {/* Header with Settings Icon */}
      <View className="flex-row justify-between items-center px-5 pt-6 pb-4">
        <Text 
          className="flex-1 text-2xl font-bold text-text-primary"
          testID="profile-header">
          Profile
        </Text>
        <TouchableOpacity
          onPress={handleGoToSettings}
          className="p-2 min-w-[44px] min-h-[44px] justify-center items-center"
          accessibilityLabel="Go to Settings"
          accessibilityRole="button"
          testID="settings-button">
          <SettingsIcon size={28} color="#c4b5fd" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{flexGrow: 1, padding: 20}}
        showsVerticalScrollIndicator={false}
        testID="profile-screen">
        
        {/* User Type Display */}
        <View className="items-center mb-8">
          <Text 
            className="text-xl font-semibold text-text-primary text-center"
            testID="user-type-display">
            {MOCK_USER_DATA.hdType} • {MOCK_USER_DATA.profile}
          </Text>
          <Text className="text-sm text-text-muted text-center mt-1">
            Human Design Type & Profile
          </Text>
        </View>

        {/* Primary Star System Card */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-text-secondary mb-3">
            Primary Star System
          </Text>
          <Card variant="emphasis" testID="primary-system-card">
            <View className="items-center">
              <View className="items-center mb-3">
                <StarSystemCrest
                  system={MOCK_USER_DATA.primarySystem}
                  size="lg"
                  variant="default"
                />
              </View>
              <Text 
                className="text-xl font-bold text-text-primary text-center"
                testID="primary-system-name">
                {MOCK_USER_DATA.primarySystem}
              </Text>
              <Text 
                className="text-lg font-medium text-lavender-400 text-center mt-1"
                testID="primary-system-percentage">
                {MOCK_USER_DATA.primaryPercentage}%
              </Text>
            </View>
          </Card>
        </View>

        {/* Allied Systems Cards */}
        {MOCK_USER_DATA.allies.length > 0 && (
          <View>
            <Text className="text-base font-semibold text-text-secondary mb-3">
              Allied Systems
            </Text>
            {MOCK_USER_DATA.allies.map((ally, index) => (
              <Card 
                key={index} 
                variant="default" 
                className="mb-3"
                testID={`ally-system-card-${index}`}>
                <View className="flex-row items-center">
                  <View className="mr-4">
                    <StarSystemCrest
                      system={ally.system}
                      size="md"
                      variant="default"
                    />
                  </View>
                  <View className="flex-1">
                    <Text 
                      className="text-base font-semibold text-text-primary"
                      testID={`ally-system-name-${index}`}>
                      {ally.system}
                    </Text>
                    <Text 
                      className="text-sm text-gold-400 mt-1"
                      testID={`ally-system-percentage-${index}`}>
                      {ally.percentage}%
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}



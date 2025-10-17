/**
 * Settings Screen
 * Adapted from Figma/components/s3/screens/SettingsScreen.tsx for React Native
 * 
 * App preferences and configuration with privacy notice
 * Styled with NativeWind className utilities
 */

import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Linking} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {AppBar} from '@/components/AppBar';
import {Card} from '@/components/Card';
import {InlineAlert} from '@/components/Toast';
import {StarfieldBackground} from '@/components/StarfieldBackground';
import {
  ShieldIcon,
  BellIcon,
  EyeIcon,
  LogOutIcon,
  TrashIcon,
  ChevronRightIcon,
} from '@/components/icons';

type Props = ScreenProps<'Settings'>;

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onPress?: () => void;
  variant?: 'default' | 'destructive';
  testID?: string;
}

function SettingsItem({
  icon,
  label,
  description,
  onPress,
  variant = 'default',
  testID,
}: SettingsItemProps) {
  const isDestructive = variant === 'destructive';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-3 p-4 rounded-lg"
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${
          isDestructive ? 'bg-semantic-error/10' : 'bg-lavender-500/20'
        }`}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<{size?: number; color?: string}>, {
              size: 20,
              color: isDestructive ? '#ff4444' : '#b8a3ff',
            })
          : icon}
      </View>
      <View className="flex-1">
        <Text
          className={`text-sm font-normal ${
            isDestructive ? 'text-semantic-error' : 'text-text-primary'
          }`}
        >
          {label}
        </Text>
        {description && (
          <Text className="text-xs text-text-subtle mt-0.5 leading-4">
            {description}
          </Text>
        )}
      </View>
      <ChevronRightIcon
        size={20}
        color={isDestructive ? '#ff4444' : '#6b5b95'}
      />
    </TouchableOpacity>
  );
}

export function SettingsScreen({navigation}: Props) {
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(true);

  const handlePrivacySettings = () => {
    console.log('Privacy settings');
  };

  const handleNotificationSettings = () => {
    console.log('Notification settings');
  };

  const handleDisplaySettings = () => {
    console.log('Display settings');
  };

  const handleSignOut = () => {
    console.log('Sign out');
  };

  const handleDeleteAccount = () => {
    console.log('Delete account');
  };

  const handleTermsPress = () => {
    Linking.openURL('https://example.com/terms');
  };

  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://example.com/privacy');
  };

  return (
    <View className="flex-1" testID="settings-screen">
      <StarfieldBackground />

      <AppBar
        title="Settings & Privacy"
        showBack
        onBack={() => navigation.goBack()}
        testID="settings-app-bar"
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-4 px-4"
      >
        {/* Privacy Notice */}
        {showPrivacyAlert && (
          <View className="mb-6">
            <InlineAlert
              type="info"
              message="S³ does not collect PII or sensitive data. All chart data stays on your device unless you opt-in to cloud sync."
              onDismiss={() => setShowPrivacyAlert(false)}
              testID="privacy-alert"
            />
          </View>
        )}

        {/* Privacy Section */}
        <View className="mb-6">
          <Text className="text-xs text-text-subtle tracking-widest uppercase mb-3 px-1">
            PRIVACY & SECURITY
          </Text>
          <Card testID="privacy-card">
            <SettingsItem
              icon={<ShieldIcon />}
              label="Data & Privacy"
              description="Manage what data is stored and shared"
              onPress={handlePrivacySettings}
              testID="privacy-settings-item"
            />
          </Card>
        </View>

        {/* Notifications Section */}
        <View className="mb-6">
          <Text className="text-xs text-text-subtle tracking-widest uppercase mb-3 px-1">
            NOTIFICATIONS
          </Text>
          <Card testID="notifications-card">
            <SettingsItem
              icon={<BellIcon />}
              label="Notification Preferences"
              description="Community updates and quest alerts"
              onPress={handleNotificationSettings}
              testID="notification-settings-item"
            />
          </Card>
        </View>

        {/* Display Section */}
        <View className="mb-6">
          <Text className="text-xs text-text-subtle tracking-widest uppercase mb-3 px-1">
            DISPLAY
          </Text>
          <Card testID="display-card">
            <SettingsItem
              icon={<EyeIcon />}
              label="Display Preferences"
              description="Starfield intensity and animations"
              onPress={handleDisplaySettings}
              testID="display-settings-item"
            />
          </Card>
        </View>

        {/* Account Section */}
        <View className="mb-6">
          <Text className="text-xs text-text-subtle tracking-widest uppercase mb-3 px-1">
            ACCOUNT
          </Text>
          <View className="gap-2">
            <Card testID="sign-out-card">
              <SettingsItem
                icon={<LogOutIcon />}
                label="Sign Out"
                description="Sign out of your account"
                onPress={handleSignOut}
                testID="sign-out-item"
              />
            </Card>
            <Card variant="warning" testID="delete-account-card">
              <SettingsItem
                icon={<TrashIcon />}
                label="Delete Account"
                description="Permanently remove all data"
                onPress={handleDeleteAccount}
                variant="destructive"
                testID="delete-account-item"
              />
            </Card>
          </View>
        </View>

        {/* Legal */}
        <View className="mb-8">
          <Text className="text-xs text-text-subtle text-center mb-2">
            Version 1.0.0
          </Text>
          <View className="flex-row justify-center gap-4">
            <TouchableOpacity
              onPress={handleTermsPress}
              accessibilityRole="link"
              testID="terms-link"
            >
              <Text className="text-xs text-lavender-300 underline">
                Terms of Service
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePrivacyPolicyPress}
              accessibilityRole="link"
              testID="privacy-policy-link"
            >
              <Text className="text-xs text-lavender-300 underline">
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}



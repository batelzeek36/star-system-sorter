/**
 * Settings Screen
 * Adapted from Figma/components/s3/screens/SettingsScreen.tsx for React Native
 * 
 * App preferences and configuration with privacy notice
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking} from 'react-native';
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
import {useTheme} from '@/theme';

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
  const theme = useTheme();

  const isDestructive = variant === 'destructive';
  const iconBgColor = isDestructive
    ? `${theme.colors.semantic.error}1A` // 10% opacity
    : `${theme.colors.lavender[500]}33`; // 20% opacity
  const iconColor = isDestructive ? theme.colors.semantic.error : theme.colors.lavender[400];
  const labelColor = isDestructive ? theme.colors.semantic.error : theme.colors.text.primary;
  const chevronColor = isDestructive ? theme.colors.semantic.error : theme.colors.text.subtle;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.settingsItem,
        {
          padding: theme.spacing[4],
          borderRadius: theme.borderRadius.lg,
        },
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
    >
      <View
        style={[
          styles.iconContainer,
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: iconBgColor,
          },
        ]}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<{size?: number; color?: string}>, {
              size: 20,
              color: iconColor,
            })
          : icon}
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            {
              color: labelColor,
              fontSize: theme.typography.fontSize.sm,
            },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.text.subtle,
                fontSize: theme.typography.fontSize.xs,
                marginTop: 2,
              },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      <ChevronRightIcon size={20} color={chevronColor} />
    </TouchableOpacity>
  );
}

export function SettingsScreen({navigation}: Props) {
  const theme = useTheme();
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
    <View style={styles.container} testID="settings-screen">
      <StarfieldBackground />

      <AppBar
        title="Settings & Privacy"
        showBack
        onBack={() => navigation.goBack()}
        testID="settings-app-bar"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingHorizontal: theme.spacing[4]},
        ]}
      >
        {/* Privacy Notice */}
        {showPrivacyAlert && (
          <View style={{marginBottom: theme.spacing[6]}}>
            <InlineAlert
              type="info"
              message="S³ does not collect PII or sensitive data. All chart data stays on your device unless you opt-in to cloud sync."
              onDismiss={() => setShowPrivacyAlert(false)}
              testID="privacy-alert"
            />
          </View>
        )}

        {/* Privacy Section */}
        <View style={{marginBottom: theme.spacing[6]}}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: theme.colors.text.subtle,
                fontSize: theme.typography.fontSize.xs,
                marginBottom: theme.spacing[3],
                paddingHorizontal: theme.spacing[1],
              },
            ]}
          >
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
        <View style={{marginBottom: theme.spacing[6]}}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: theme.colors.text.subtle,
                fontSize: theme.typography.fontSize.xs,
                marginBottom: theme.spacing[3],
                paddingHorizontal: theme.spacing[1],
              },
            ]}
          >
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
        <View style={{marginBottom: theme.spacing[6]}}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: theme.colors.text.subtle,
                fontSize: theme.typography.fontSize.xs,
                marginBottom: theme.spacing[3],
                paddingHorizontal: theme.spacing[1],
              },
            ]}
          >
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
        <View style={{marginBottom: theme.spacing[6]}}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: theme.colors.text.subtle,
                fontSize: theme.typography.fontSize.xs,
                marginBottom: theme.spacing[3],
                paddingHorizontal: theme.spacing[1],
              },
            ]}
          >
            ACCOUNT
          </Text>
          <View style={{gap: theme.spacing[2]}}>
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
        <View style={{marginBottom: theme.spacing[8]}}>
          <Text
            style={[
              styles.versionText,
              {
                color: theme.colors.text.subtle,
                fontSize: theme.typography.fontSize.xs,
                marginBottom: theme.spacing[2],
              },
            ]}
          >
            Version 1.0.0
          </Text>
          <View style={styles.legalLinks}>
            <TouchableOpacity
              onPress={handleTermsPress}
              accessibilityRole="link"
              testID="terms-link"
            >
              <Text
                style={[
                  styles.legalLink,
                  {
                    color: theme.colors.lavender[300],
                    fontSize: theme.typography.fontSize.xs,
                  },
                ]}
              >
                Terms of Service
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePrivacyPolicyPress}
              accessibilityRole="link"
              testID="privacy-policy-link"
            >
              <Text
                style={[
                  styles.legalLink,
                  {
                    color: theme.colors.lavender[300],
                    fontSize: theme.typography.fontSize.xs,
                  },
                ]}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  sectionHeader: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '400',
  },
  description: {
    lineHeight: 16,
  },
  versionText: {
    textAlign: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legalLink: {
    textDecorationLine: 'underline',
  },
});

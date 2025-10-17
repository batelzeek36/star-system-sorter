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
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import type {ScreenProps} from '@/navigation/types';
import {Card, StarSystemCrest, type StarSystemName} from '@/components';
import {SettingsIcon} from '@/components/icons';
import {useTheme} from '@/theme';
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
  const theme = useTheme();

  const handleGoToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.root}>
      <StarfieldBackground />
      
      {/* Header with Settings Icon */}
      <View 
        style={[
          styles.header,
          {
            paddingHorizontal: theme.spacing[5],
            paddingTop: theme.spacing[6],
            paddingBottom: theme.spacing[4],
          }
        ]}>
        <Text 
          style={[
            styles.headerTitle,
            {
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
            }
          ]}
          testID="profile-header">
          Profile
        </Text>
        <TouchableOpacity
          onPress={handleGoToSettings}
          style={styles.settingsButton}
          accessibilityLabel="Go to Settings"
          accessibilityRole="button"
          testID="settings-button">
          <SettingsIcon size={28} color={theme.colors.lavender[400]} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.container,
          {padding: theme.spacing[5]}
        ]}
        showsVerticalScrollIndicator={false}
        testID="profile-screen">
        
        {/* User Type Display */}
        <View style={[styles.userTypeSection, {marginBottom: theme.spacing[8]}]}>
          <Text 
            style={[
              styles.userType,
              {
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                textAlign: 'center',
              }
            ]}
            testID="user-type-display">
            {MOCK_USER_DATA.hdType} • {MOCK_USER_DATA.profile}
          </Text>
          <Text 
            style={[
              styles.userTypeLabel,
              {
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.muted,
                textAlign: 'center',
                marginTop: theme.spacing[1],
              }
            ]}>
            Human Design Type & Profile
          </Text>
        </View>

        {/* Primary Star System Card */}
        <View style={[styles.section, {marginBottom: theme.spacing[6]}]}>
          <Text 
            style={[
              styles.sectionTitle,
              {
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing[3],
              }
            ]}>
            Primary Star System
          </Text>
          <Card variant="emphasis" testID="primary-system-card">
            <View style={styles.systemCard}>
              <View style={[styles.crestContainer, {marginBottom: theme.spacing[3]}]}>
                <StarSystemCrest
                  system={MOCK_USER_DATA.primarySystem}
                  size="lg"
                  variant="default"
                />
              </View>
              <Text 
                style={[
                  styles.systemName,
                  {
                    fontSize: theme.typography.fontSize.xl,
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.text.primary,
                    textAlign: 'center',
                  }
                ]}
                testID="primary-system-name">
                {MOCK_USER_DATA.primarySystem}
              </Text>
              <Text 
                style={[
                  styles.systemPercentage,
                  {
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.lavender[400],
                    textAlign: 'center',
                    marginTop: theme.spacing[1],
                  }
                ]}
                testID="primary-system-percentage">
                {MOCK_USER_DATA.primaryPercentage}%
              </Text>
            </View>
          </Card>
        </View>

        {/* Allied Systems Cards */}
        {MOCK_USER_DATA.allies.length > 0 && (
          <View style={styles.section}>
            <Text 
              style={[
                styles.sectionTitle,
                {
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing[3],
                }
              ]}>
              Allied Systems
            </Text>
            {MOCK_USER_DATA.allies.map((ally, index) => (
              <Card 
                key={index} 
                variant="default" 
                style={{marginBottom: theme.spacing[3]}}
                testID={`ally-system-card-${index}`}>
                <View style={styles.allyCard}>
                  <View style={styles.allyLeft}>
                    <StarSystemCrest
                      system={ally.system}
                      size="md"
                      variant="default"
                    />
                  </View>
                  <View style={styles.allyRight}>
                    <Text 
                      style={[
                        styles.allyName,
                        {
                          fontSize: theme.typography.fontSize.base,
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.text.primary,
                        }
                      ]}
                      testID={`ally-system-name-${index}`}>
                      {ally.system}
                    </Text>
                    <Text 
                      style={[
                        styles.allyPercentage,
                        {
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.gold[400],
                          marginTop: theme.spacing[1],
                        }
                      ]}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0612', // canvas.dark
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
  },
  settingsButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
  },
  userTypeSection: {
    alignItems: 'center',
  },
  userType: {
    // Styles applied inline with theme
  },
  userTypeLabel: {
    // Styles applied inline with theme
  },
  section: {
    // Styles applied inline with theme
  },
  sectionTitle: {
    // Styles applied inline with theme
  },
  systemCard: {
    alignItems: 'center',
  },
  crestContainer: {
    alignItems: 'center',
  },
  systemName: {
    // Styles applied inline with theme
  },
  systemPercentage: {
    // Styles applied inline with theme
  },
  allyCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allyLeft: {
    marginRight: 16,
  },
  allyRight: {
    flex: 1,
  },
  allyName: {
    // Styles applied inline with theme
  },
  allyPercentage: {
    // Styles applied inline with theme
  },
});

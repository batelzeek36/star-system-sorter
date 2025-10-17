/**
 * Empty States Screen
 * Adapted from Figma/components/s3/screens/EmptyStatesScreen.tsx for React Native
 * 
 * Examples of empty states and error handling patterns
 */

import React, { type ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppBar } from '../components/AppBar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { InlineAlert } from '../components/Toast';
import { StarfieldBackground } from '../components/StarfieldBackground';
import { useTheme } from '../theme';
import {
  SparklesIcon,
  AlertTriangleIcon,
  WifiOffIcon,
  FileQuestionIcon,
} from '../components/icons/EmptyStateIcons';

interface EmptyStatesScreenProps {
  onBack: () => void;
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'error';
  testID?: string;
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  testID,
}: EmptyStateProps) {
  const theme = useTheme();

  const iconBackgroundColor =
    variant === 'error'
      ? `${theme.colors.semantic.error}33` // 20% opacity
      : undefined;

  const iconColor = variant === 'error' ? theme.colors.semantic.error : theme.colors.lavender[400];

  const titleColor = variant === 'error' ? theme.colors.gold[300] : theme.colors.lavender[200];

  return (
    <Card
      variant={variant === 'error' ? 'warning' : 'default'}
      style={styles.emptyStateCard}
      testID={testID}
    >
      <View style={styles.emptyStateContent}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: iconBackgroundColor || `${theme.colors.lavender[400]}33`,
              borderRadius: theme.borderRadius.full,
            },
          ]}
        >
          {icon}
        </View>
        <Text
          style={[
            styles.title,
            {
              color: titleColor,
              fontSize: theme.typography.fontSize.lg,
              marginBottom: theme.spacing[2],
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.description,
            {
              color: theme.colors.text.muted,
              fontSize: theme.typography.fontSize.sm,
              lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.relaxed,
              marginBottom: theme.spacing[4],
              paddingHorizontal: theme.spacing[4],
            },
          ]}
        >
          {description}
        </Text>
        {actionLabel && onAction && (
          <Button
            variant={variant === 'error' ? 'secondary' : 'primary'}
            size="sm"
            onPress={onAction}
            testID={testID ? `${testID}-action` : undefined}
          >
            {actionLabel}
          </Button>
        )}
      </View>
    </Card>
  );
}

export function EmptyStatesScreen({ onBack }: EmptyStatesScreenProps) {
  const theme = useTheme();

  return (
    <View style={styles.container} testID="empty-states-screen">
      <StarfieldBackground />

      <AppBar title="Empty States & Errors" showBack onBack={onBack} testID="empty-states-app-bar" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: theme.spacing[4] },
        ]}
      >
        <Text
          style={[
            styles.sectionLabel,
            {
              color: theme.colors.text.subtle,
              fontSize: theme.typography.fontSize.xs,
              marginBottom: theme.spacing[4],
              paddingHorizontal: theme.spacing[1],
            },
          ]}
        >
          Examples of empty states and error handling
        </Text>

        {/* No Chart Computed Yet */}
        <EmptyState
          icon={<SparklesIcon size={32} color={theme.colors.lavender[400]} />}
          title="No Chart Yet"
          description="Enter your birth data to compute your star system alignment and discover your cosmic origins."
          actionLabel="Begin Sorting"
          onAction={() => console.log('Navigate to input')}
          testID="empty-state-no-chart"
        />

        {/* Network Error */}
        <EmptyState
          icon={<WifiOffIcon size={32} color={theme.colors.semantic.error} />}
          title="Connection Lost"
          description="Unable to sync with cloud. Your data is safe and stored locally. Try again when connection is restored."
          actionLabel="Retry"
          onAction={() => console.log('Retry connection')}
          variant="error"
          testID="empty-state-network-error"
        />

        {/* Invalid Chart Data */}
        <EmptyState
          icon={<AlertTriangleIcon size={32} color={theme.colors.semantic.error} />}
          title="Invalid Chart Data"
          description="We couldn't process your chart. Please check your birth date, time, and location are correct."
          actionLabel="Edit Details"
          onAction={() => console.log('Edit chart data')}
          variant="error"
          testID="empty-state-invalid-data"
        />

        {/* No Community Posts */}
        <EmptyState
          icon={<FileQuestionIcon size={32} color={theme.colors.lavender[400]} />}
          title="No Posts Yet"
          description="Your star system community is just getting started. Be the first to share your journey!"
          actionLabel="Create Post"
          onAction={() => console.log('Create post')}
          testID="empty-state-no-posts"
        />

        {/* Inline Error Alerts */}
        <View style={[styles.section, { marginBottom: theme.spacing[4] }]}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: theme.colors.text.subtle,
                fontSize: theme.typography.fontSize.xs,
                marginBottom: theme.spacing[3],
                paddingHorizontal: theme.spacing[1],
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              },
            ]}
          >
            Inline Alerts
          </Text>
          <View style={styles.alertsContainer}>
            <InlineAlert
              type="error"
              message="Failed to generate narrative. LLM service is temporarily unavailable."
              testID="inline-alert-error"
            />
            <InlineAlert
              type="warning"
              message="Your subscription expires in 3 days. Renew to keep community access."
              testID="inline-alert-warning"
            />
            <InlineAlert
              type="info"
              message="New quest available in your star system community!"
              testID="inline-alert-info"
            />
            <InlineAlert
              type="success"
              message="Chart successfully computed. Your primary star system is Pleiades."
              testID="inline-alert-success"
            />
          </View>
        </View>

        {/* Disclaimer Example */}
        <View style={[styles.section, { marginBottom: theme.spacing[8] }]}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: theme.colors.text.subtle,
                fontSize: theme.typography.fontSize.xs,
                marginBottom: theme.spacing[3],
                paddingHorizontal: theme.spacing[1],
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              },
            ]}
          >
            Disclaimer Example
          </Text>
          <View
            style={[
              styles.disclaimer,
              {
                padding: theme.spacing[3],
                backgroundColor: `${theme.colors.lavender[900]}1A`, // 10% opacity
                borderColor: theme.colors.borders.muted,
                borderWidth: 1,
                borderRadius: theme.borderRadius.xl,
              },
            ]}
          >
            <Text
              style={[
                styles.disclaimerText,
                {
                  color: theme.colors.text.subtle,
                  fontSize: theme.typography.fontSize.xs,
                  lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.relaxed,
                },
              ]}
            >
              For insight & entertainment. Not medical, financial, or legal advice.
            </Text>
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
    paddingBottom: 32,
  },
  sectionLabel: {
    // Styles applied inline
  },
  emptyStateCard: {
    marginBottom: 16,
  },
  emptyStateContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  section: {
    // Styles applied inline
  },
  sectionHeader: {
    // Styles applied inline
  },
  alertsContainer: {
    gap: 12,
  },
  disclaimer: {
    // Styles applied inline
  },
  disclaimerText: {
    // Styles applied inline
  },
});

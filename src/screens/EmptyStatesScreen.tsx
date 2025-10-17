/**
 * Empty States Screen
 * Adapted from Figma/components/s3/screens/EmptyStatesScreen.tsx for React Native
 * 
 * Examples of empty states and error handling patterns
 */

import React, { type ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppBar } from '../components/AppBar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { InlineAlert } from '../components/Toast';
import { StarfieldBackground } from '../components/StarfieldBackground';
import { colors, spacing, typography } from '../theme/tokens';
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
  const iconBackgroundColor =
    variant === 'error'
      ? `${colors.semantic.error}33` // 20% opacity
      : undefined;

  const titleColor = variant === 'error' ? colors.gold[300] : colors.lavender[200];

  return (
    <Card
      variant={variant === 'error' ? 'warning' : 'default'}
      style={{marginBottom: 16}}
      testID={testID}
    >
      <View style={{alignItems: 'center', paddingVertical: 32}}>
        <View
          style={{
            width: 64,
            height: 64,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            backgroundColor: iconBackgroundColor || `${colors.lavender[400]}33`,
            borderRadius: 9999,
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            textAlign: 'center',
            color: titleColor,
            fontSize: typography.fontSize.lg,
            marginBottom: spacing[2],
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: colors.text.muted,
            fontSize: typography.fontSize.sm,
            lineHeight: typography.fontSize.sm * 1.75,
            marginBottom: spacing[4],
            paddingHorizontal: spacing[4],
          }}
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

  return (
    <View style={{flex: 1}} testID="empty-states-screen">
      <StarfieldBackground />

      <AppBar title="Empty States & Errors" showBack onBack={onBack} testID="empty-states-app-bar" />

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          paddingBottom: 32,
          paddingHorizontal: spacing[4],
        }}
      >
        <Text
          style={{
            color: colors.text.subtle,
            fontSize: typography.fontSize.xs,
            marginBottom: spacing[4],
            paddingHorizontal: spacing[1],
          }}
        >
          Examples of empty states and error handling
        </Text>

        {/* No Chart Computed Yet */}
        <EmptyState
          icon={<SparklesIcon size={32} color={colors.lavender[400]} />}
          title="No Chart Yet"
          description="Enter your birth data to compute your star system alignment and discover your cosmic origins."
          actionLabel="Begin Sorting"
          onAction={() => console.log('Navigate to input')}
          testID="empty-state-no-chart"
        />

        {/* Network Error */}
        <EmptyState
          icon={<WifiOffIcon size={32} color={colors.semantic.error} />}
          title="Connection Lost"
          description="Unable to sync with cloud. Your data is safe and stored locally. Try again when connection is restored."
          actionLabel="Retry"
          onAction={() => console.log('Retry connection')}
          variant="error"
          testID="empty-state-network-error"
        />

        {/* Invalid Chart Data */}
        <EmptyState
          icon={<AlertTriangleIcon size={32} color={colors.semantic.error} />}
          title="Invalid Chart Data"
          description="We couldn't process your chart. Please check your birth date, time, and location are correct."
          actionLabel="Edit Details"
          onAction={() => console.log('Edit chart data')}
          variant="error"
          testID="empty-state-invalid-data"
        />

        {/* No Community Posts */}
        <EmptyState
          icon={<FileQuestionIcon size={32} color={colors.lavender[400]} />}
          title="No Posts Yet"
          description="Your star system community is just getting started. Be the first to share your journey!"
          actionLabel="Create Post"
          onAction={() => console.log('Create post')}
          testID="empty-state-no-posts"
        />

        {/* Inline Error Alerts */}
        <View style={{marginBottom: spacing[4]}}>
          <Text
            style={{
              color: colors.text.subtle,
              fontSize: typography.fontSize.xs,
              marginBottom: spacing[3],
              paddingHorizontal: spacing[1],
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            Inline Alerts
          </Text>
          <View style={{gap: 12}}>
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
        <View style={{marginBottom: spacing[8]}}>
          <Text
            style={{
              color: colors.text.subtle,
              fontSize: typography.fontSize.xs,
              marginBottom: spacing[3],
              paddingHorizontal: spacing[1],
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            Disclaimer Example
          </Text>
          <View
            style={{
              padding: spacing[3],
              backgroundColor: `${colors.lavender[900]}1A`, // 10% opacity
              borderColor: colors.borders.muted,
              borderWidth: 1,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color: colors.text.subtle,
                fontSize: typography.fontSize.xs,
                lineHeight: typography.fontSize.xs * 1.75,
              }}
            >
              For insight & entertainment. Not medical, financial, or legal advice.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

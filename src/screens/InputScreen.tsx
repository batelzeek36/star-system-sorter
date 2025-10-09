/**
 * Input Screen
 * Birth data entry form with validation
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {ScreenProps} from '@/navigation/types';

type Props = ScreenProps<'Input'>;

// Zod schema as single source of truth for validation
const birthDataSchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format'),
  time: z
    .string()
    .min(1, 'Time is required')
    .regex(/^\d{2}:\d{2} (AM|PM)$/, 'Time must be in HH:MM AM/PM format'),
  location: z.string().min(1, 'Location is required'),
  timeZone: z.string().min(1, 'Time zone is required'),
});

type BirthDataForm = z.infer<typeof birthDataSchema>;

export function InputScreen({navigation}: Props) {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<BirthDataForm>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      date: '',
      time: '',
      location: '',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const onSubmit = async (data: BirthDataForm) => {
    // TODO: Wire to hdkit adapter in task 2.4
    // For now, navigate with mock data
    console.log('Form data:', data);

    navigation.navigate('Result', {
      classification: 'primary',
      primary: 'Pleiades',
      percentage: 67.5,
      allies: [
        {system: 'Sirius', percentage: 18.2},
        {system: 'Arcturus', percentage: 14.3},
      ],
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Enter Birth Data</Text>
          <Text style={styles.subtitle}>
            We'll use this to calculate your star system classification
          </Text>
        </View>

        <View style={styles.form}>
          {/* Date Field */}
          <View style={styles.formItem}>
            <Text style={[styles.label, errors.date && styles.labelError]}>
              Birth Date
            </Text>
            <Controller
              control={control}
              name="date"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.date && styles.inputError]}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#999999"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numbers-and-punctuation"
                  accessibilityLabel="Birth date"
                  accessibilityHint="Enter your birth date in MM/DD/YYYY format"
                  aria-invalid={!!errors.date}
                />
              )}
            />
            {errors.date && (
              <Text style={styles.errorText}>{errors.date.message}</Text>
            )}
          </View>

          {/* Time Field */}
          <View style={styles.formItem}>
            <Text style={[styles.label, errors.time && styles.labelError]}>
              Birth Time
            </Text>
            <Controller
              control={control}
              name="time"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.time && styles.inputError]}
                  placeholder="HH:MM AM/PM"
                  placeholderTextColor="#999999"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="default"
                  accessibilityLabel="Birth time"
                  accessibilityHint="Enter your birth time in HH:MM AM/PM format"
                  aria-invalid={!!errors.time}
                />
              )}
            />
            {errors.time && (
              <Text style={styles.errorText}>{errors.time.message}</Text>
            )}
          </View>

          {/* Location Field */}
          <View style={styles.formItem}>
            <Text style={[styles.label, errors.location && styles.labelError]}>
              Birth Location
            </Text>
            <Controller
              control={control}
              name="location"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.location && styles.inputError]}
                  placeholder="City, State/Country"
                  placeholderTextColor="#999999"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="default"
                  accessibilityLabel="Birth location"
                  accessibilityHint="Enter your birth location"
                  aria-invalid={!!errors.location}
                />
              )}
            />
            {errors.location && (
              <Text style={styles.errorText}>{errors.location.message}</Text>
            )}
          </View>

          {/* Time Zone Field */}
          <View style={styles.formItem}>
            <Text style={[styles.label, errors.timeZone && styles.labelError]}>
              Time Zone
            </Text>
            <Controller
              control={control}
              name="timeZone"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.timeZone && styles.inputError]}
                  placeholder="IANA Time Zone"
                  placeholderTextColor="#999999"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="default"
                  accessibilityLabel="Time zone"
                  accessibilityHint="IANA time zone identifier"
                  aria-invalid={!!errors.timeZone}
                />
              )}
            />
            {errors.timeZone && (
              <Text style={styles.errorText}>{errors.timeZone.message}</Text>
            )}
            <Text style={styles.helperText}>
              Detected: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            accessibilityLabel="Calculate classification"
            accessibilityRole="button"
            accessibilityHint="Submit form to calculate your star system classification">
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Processing...' : 'Calculate'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  form: {
    gap: 20,
  },
  formItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  labelError: {
    color: '#dc2626',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

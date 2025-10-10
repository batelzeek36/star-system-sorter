/**
 * Input Screen
 * Birth data entry form with validation
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {ScreenProps} from '@/navigation/types';
import {TimeZonePicker} from '@/components/TimeZonePicker';
import {computeHDExtract} from '@/hd';
import {classify} from '@/scorer';

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: {errors},
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
    setIsProcessing(true);
    
    try {
      // Parse date from MM/DD/YYYY to YYYY-MM-DD (ISO format)
      const [month, day, year] = data.date.split('/');
      const dateISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      // Parse time from HH:MM AM/PM to 24-hour HH:mm format
      const timeMatch = data.time.match(/^(\d{2}):(\d{2}) (AM|PM)$/);
      if (!timeMatch) {
        throw new Error('Invalid time format');
      }
      
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];
      const period = timeMatch[3];
      
      // Convert to 24-hour format
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      const time24 = `${String(hours).padStart(2, '0')}:${minutes}`;
      
      console.log('[InputScreen] Processing birth data:', {
        dateISO,
        time24,
        timeZone: data.timeZone,
        location: data.location,
      });
      
      // Step 1: Compute HD extract from birth data
      const hdExtract = await computeHDExtract({
        dateISO,
        time: time24,
        timeZone: data.timeZone,
        // Note: lat/lon would come from geocoding the location
        // For MVP, we skip geocoding and pass undefined
      });
      
      console.log('[InputScreen] HD Extract computed:', hdExtract);
      
      // Step 2: Classify the HD extract into star system
      // Note: classify() will throw until tasks 3.2-3.4 are complete
      // For now, we'll catch and show a helpful message
      try {
        const result = await classify(hdExtract);
        
        console.log('[InputScreen] Classification result:', result);
        
        // Step 3: Navigate to Result screen with classification
        navigation.navigate('Result', {
          classification: result.classification,
          primary: result.primary,
          hybrid: result.hybrid,
          percentage: result.primary 
            ? result.percentages[result.primary] 
            : result.hybrid 
            ? Math.max(result.percentages[result.hybrid[0]], result.percentages[result.hybrid[1]])
            : 0,
          allies: result.allies,
          contributorsPerSystem: result.contributorsPerSystem,
          percentages: result.percentages,
        });
      } catch (classifyError) {
        // Scorer not yet implemented (tasks 3.2-3.4)
        // Show user-friendly message and navigate with mock data for testing
        console.warn('Scorer not yet implemented:', classifyError);
        
        Alert.alert(
          'Development Mode',
          'The scoring system is not yet implemented. Showing sample results for testing.',
          [{text: 'OK'}]
        );
        
        // Navigate with mock data based on HD extract
        navigation.navigate('Result', {
          classification: 'primary',
          primary: 'Pleiades',
          percentage: 67.5,
          allies: [
            {system: 'Sirius', percentage: 18.2},
            {system: 'Arcturus', percentage: 14.3},
          ],
          contributorsPerSystem: {
            Pleiades: [`type_${hdExtract.type.toLowerCase()}`, ...hdExtract.gates.slice(0, 3).map(g => `gate_${g}`)],
            Sirius: hdExtract.centers.slice(0, 2).map(c => `center_${c.toLowerCase()}`),
            Arcturus: hdExtract.channels.slice(0, 2).map(ch => `channel_${ch}`),
          },
          percentages: {
            Pleiades: 67.5,
            Sirius: 18.2,
            Arcturus: 14.3,
          },
        });
      }
    } catch (error) {
      // Handle errors gracefully with user-friendly messages
      console.error('Error processing birth data:', error);
      
      let errorTitle = 'Error';
      let errorMessage = 'Unable to process your birth data. Please check your inputs and try again.';
      
      if (error instanceof Error) {
        // Network errors (offline, airplane mode)
        if (error.message.includes('No internet connection')) {
          errorTitle = 'No Internet Connection';
          errorMessage = 'Please check your network and try again.';
        }
        // Server errors
        else if (error.message.includes('Server error')) {
          errorTitle = 'Service Unavailable';
          errorMessage = 'The service is temporarily unavailable. Please try again later.';
        }
        // Rate limiting
        else if (error.message.includes('Rate limit')) {
          errorTitle = 'Too Many Requests';
          errorMessage = 'Please wait a moment before trying again.';
        }
        // Invalid input
        else if (error.message.includes('Invalid input')) {
          errorTitle = 'Invalid Data';
          errorMessage = 'Please check your birth date, time, and timezone.';
        }
        // Server misconfiguration
        else if (error.message.includes('Server misconfiguration')) {
          errorTitle = 'Service Error';
          errorMessage = 'There is a configuration issue. Please contact support.';
        }
        // Format errors
        else if (error.message.includes('Invalid time format')) {
          errorMessage = 'Invalid time format. Please use HH:MM AM/PM format.';
        } else if (error.message.includes('Invalid date')) {
          errorMessage = 'Invalid date. Please use MM/DD/YYYY format.';
        } else if (error.message.includes('timezone')) {
          errorMessage = 'Invalid timezone. Please select a valid timezone.';
        }
      }
      
      Alert.alert(
        errorTitle,
        errorMessage,
        [{text: 'OK'}]
      );
    } finally {
      setIsProcessing(false);
    }
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
              render={({field: {onChange, value}}) => (
                <TimeZonePicker
                  value={value}
                  onChange={onChange}
                  error={!!errors.timeZone}
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
            style={[styles.button, isProcessing && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isProcessing}
            accessibilityLabel="Calculate classification"
            accessibilityRole="button"
            accessibilityHint="Submit form to calculate your star system classification">
            <Text style={styles.buttonText}>
              {isProcessing ? 'Processing...' : 'Calculate'}
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

/**
 * Input Screen
 * Birth data entry form with validation
 * Adapted from Figma 02_Input_BirthData design
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {ScreenProps} from '@/navigation/types';
import {TimeZonePicker} from '@/components/TimeZonePicker';
import {Field} from '@/components/Field';
import {Button} from '@/components/Button';
import {Toast} from '@/components/Toast';
import {CalendarIcon, ClockIcon, LocationIcon} from '@/components/icons';
import {computeHDExtract} from '@/hd';
import {classify} from '@/scorer';
import {useTheme} from '@/theme';

type Props = ScreenProps<'Input'>;

type TabType = 'birthData' | 'uploadPdf';

// Zod schema as single source of truth for validation
const birthDataSchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format')
    .refine((val) => {
      // Validate date is a real date
      const [month, day, year] = val.split('/').map(Number);
      if (!month || !day || !year) return false;
      
      // Check month range
      if (month < 1 || month > 12) return false;
      
      // Check day range based on month
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) return false;
      
      // Check year range (1900-current year)
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) return false;
      
      return true;
    }, 'Please enter a valid date'),
  time: z
    .string()
    .min(1, 'Time is required')
    .regex(/^\d{2}:\d{2} (AM|PM)$/, 'Time must be in HH:MM AM/PM format')
    .refine((val) => {
      // Validate time components
      const match = val.match(/^(\d{2}):(\d{2}) (AM|PM)$/);
      if (!match) return false;
      
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      
      // Check hours range (01-12 for 12-hour format)
      if (hours < 1 || hours > 12) return false;
      
      // Check minutes range (00-59)
      if (minutes < 0 || minutes > 59) return false;
      
      return true;
    }, 'Please enter a valid time'),
  location: z
    .string()
    .min(1, 'Location is required')
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .refine((val) => {
      // Basic validation: should contain letters and optionally comma/space
      return /^[a-zA-Z\s,.-]+$/.test(val);
    }, 'Location should only contain letters, spaces, and basic punctuation'),
  timeZone: z.string().min(1, 'Time zone is required'),
});

type BirthDataForm = z.infer<typeof birthDataSchema>;

export function InputScreen({navigation}: Props) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('birthData');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<BirthDataForm>({
    resolver: zodResolver(birthDataSchema),
    mode: 'onBlur', // Validate on blur for real-time feedback
    reValidateMode: 'onChange', // Re-validate on change after first validation
    defaultValues: {
      date: '',
      time: '',
      location: '',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const onSubmit = async (data: BirthDataForm) => {
    setIsProcessing(true);
    setToast({message: 'Computing your chart...', type: 'success'});
    
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
      
      let errorMessage = 'Unable to process your birth data. Please check your inputs and try again.';
      
      if (error instanceof Error) {
        // Network errors (offline, airplane mode)
        if (error.message.includes('No internet connection')) {
          errorMessage = 'No internet connection. Please check your network and try again.';
        }
        // Server errors
        else if (error.message.includes('Server error')) {
          errorMessage = 'Service temporarily unavailable. Please try again later.';
        }
        // Rate limiting
        else if (error.message.includes('Rate limit')) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        }
        // Invalid input
        else if (error.message.includes('Invalid input')) {
          errorMessage = 'Invalid data. Please check your birth date, time, and timezone.';
        }
        // Server misconfiguration
        else if (error.message.includes('Server misconfiguration')) {
          errorMessage = 'Service error. Please contact support.';
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
      
      setToast({message: errorMessage, type: 'error'});
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: theme.colors.canvas.dark}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          testID="input-toast"
        />
      )}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.bold,
              },
            ]}>
            Enter Birth Data
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.sm,
                marginTop: theme.spacing[2],
              },
            ]}>
            We'll use this to calculate your star system classification
          </Text>
        </View>

        {/* Tabs */}
        <View
          style={[
            styles.tabContainer,
            {
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.borders.subtle,
              marginBottom: theme.spacing[6],
            },
          ]}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                minHeight: theme.components.touchTarget.minimum,
                paddingVertical: theme.spacing[3],
                paddingHorizontal: theme.spacing[4],
                borderBottomWidth: 2,
                borderBottomColor:
                  activeTab === 'birthData'
                    ? theme.colors.lavender[400]
                    : 'transparent',
              },
            ]}
            onPress={() => setActiveTab('birthData')}
            accessibilityLabel="Birth Data tab"
            accessibilityRole="tab"
            accessibilityState={{selected: activeTab === 'birthData'}}
            testID="tab-birth-data">
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'birthData'
                      ? theme.colors.lavender[300]
                      : theme.colors.text.muted,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                },
              ]}>
              Birth Data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                minHeight: theme.components.touchTarget.minimum,
                paddingVertical: theme.spacing[3],
                paddingHorizontal: theme.spacing[4],
                borderBottomWidth: 2,
                borderBottomColor:
                  activeTab === 'uploadPdf'
                    ? theme.colors.lavender[400]
                    : 'transparent',
              },
            ]}
            onPress={() => setActiveTab('uploadPdf')}
            accessibilityLabel="Upload Chart PDF tab"
            accessibilityRole="tab"
            accessibilityState={{selected: activeTab === 'uploadPdf'}}
            testID="tab-upload-pdf">
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'uploadPdf'
                      ? theme.colors.lavender[300]
                      : theme.colors.text.muted,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                },
              ]}>
              Upload Chart PDF
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'birthData' ? (
          <View style={styles.form}>
            {/* Date Field with Calendar Icon */}
            <Controller
              control={control}
              name="date"
              render={({field: {onChange, onBlur, value}}) => (
                <Field
                  label="Birth Date"
                  placeholder="MM/DD/YYYY"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numbers-and-punctuation"
                  error={errors.date?.message}
                  icon={<CalendarIcon size={20} />}
                  testID="field-date"
                />
              )}
            />

            {/* Time Field with Clock Icon */}
            <Controller
              control={control}
              name="time"
              render={({field: {onChange, onBlur, value}}) => (
                <Field
                  label="Birth Time"
                  placeholder="HH:MM AM/PM"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="default"
                  error={errors.time?.message}
                  icon={<ClockIcon size={20} />}
                  testID="field-time"
                />
              )}
            />

            {/* Location Field with Location Icon */}
            <Controller
              control={control}
              name="location"
              render={({field: {onChange, onBlur, value}}) => (
                <Field
                  label="Birth Location"
                  placeholder="City, State/Country"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="default"
                  error={errors.location?.message}
                  icon={<LocationIcon size={20} />}
                  testID="field-location"
                />
              )}
            />

            {/* Time Zone Field */}
            <View style={{marginTop: theme.spacing[4]}}>
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.lavender[300],
                    fontSize: theme.typography.fontSize.sm,
                    marginBottom: theme.spacing[2],
                    fontWeight: theme.typography.fontWeight.medium,
                  },
                ]}>
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
                <Text
                  style={[
                    styles.errorText,
                    {
                      color: theme.colors.semantic.error,
                      fontSize: theme.typography.fontSize.xs,
                      marginTop: theme.spacing[2],
                    },
                  ]}>
                  {errors.timeZone.message}
                </Text>
              )}
              <Text
                style={[
                  styles.helperText,
                  {
                    color: theme.colors.text.subtle,
                    fontSize: theme.typography.fontSize.xs,
                    marginTop: theme.spacing[2],
                  },
                ]}>
                Detected: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </Text>
            </View>

            {/* Submit Button */}
            <View style={{marginTop: theme.spacing[6]}}>
              <Button
                variant="primary"
                size="lg"
                onPress={handleSubmit(onSubmit)}
                disabled={isProcessing}
                loading={isProcessing}
                testID="button-compute-chart"
                accessibilityLabel="Compute chart">
                Compute Chart
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.uploadContainer}>
            <Text
              style={[
                styles.uploadPlaceholder,
                {
                  color: theme.colors.text.muted,
                  fontSize: theme.typography.fontSize.sm,
                  textAlign: 'center',
                },
              ]}>
              PDF upload functionality coming soon
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    lineHeight: 32,
  },
  subtitle: {
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  label: {
    fontWeight: '500',
  },
  errorText: {
    lineHeight: 18,
  },
  helperText: {
    lineHeight: 18,
  },
  uploadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  uploadPlaceholder: {
    lineHeight: 20,
  },
});

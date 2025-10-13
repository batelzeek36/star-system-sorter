/**
 * Form Components (React Native)
 * Adapted from shadcn/ui form with same API surface
 * Uses react-hook-form for form state management
 */

import React from 'react';
import {View, Text, StyleSheet, type ViewProps, type TextProps} from 'react-native';
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import {colors, spacing, fontSizes} from './theme';
import {Label} from './Label';

// Re-export FormProvider as Form
export const Form = FormProvider;

// Form Field Context
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{name: props.name}}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

// Form Item Context
type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

// Hook to access form field state
export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const {getFieldState, formState} = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const {id} = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// Form Item
export interface FormItemProps extends ViewProps {}

export function FormItem({style, ...props}: FormItemProps) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{id}}>
      <View style={[styles.formItem, style]} {...props} />
    </FormItemContext.Provider>
  );
}

// Form Label
export interface FormLabelProps extends TextProps {}

export function FormLabel({style, ...props}: FormLabelProps) {
  const {error} = useFormField();

  return <Label style={style} error={!!error} {...props} />;
}

// Form Control (wrapper for input components)
export interface FormControlProps {
  children: React.ReactElement;
}

export function FormControl({children}: FormControlProps) {
  const {error} = useFormField();

  // Clone element with error prop if supported
  return React.cloneElement(children, {
    error: !!error,
  } as any);
}

// Form Description
export interface FormDescriptionProps extends TextProps {}

export function FormDescription({style, ...props}: FormDescriptionProps) {
  return <Text style={[styles.description, style]} {...props} />;
}

// Form Message (error message)
export interface FormMessageProps extends TextProps {}

export function FormMessage({style, children, ...props}: FormMessageProps) {
  const {error} = useFormField();
  const body = error ? String(error?.message ?? '') : children;

  if (!body) {
    return null;
  }

  return <Text style={[styles.message, style]} {...props}>{body}</Text>;
}

const styles = StyleSheet.create({
  formItem: {
    gap: spacing[2],
  },
  description: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
  },
  message: {
    fontSize: fontSizes.sm,
    color: colors.destructive,
  },
});

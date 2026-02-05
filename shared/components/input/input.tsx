import React, { useCallback, useState } from 'react';
import { TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import { defaultColors } from '@core/theme/colors';
import { cn } from '@shared/utils';

import { InputFieldContainer } from './input-field';
import { InputHelperText } from './input-helper-text';
import { InputLabel } from './input-label';
import { InputProps } from './input.types';
import { getInputClassName, getTextInputClassName } from './input.utils';

// Note: placeholderTextColor requires a direct color value in React Native
// Using theme color instead of className (RN limitation)
const PLACEHOLDER_COLOR = defaultColors.text.secondary;

type FocusHandler = NonNullable<TextInputProps['onFocus']>;
type BlurHandler = NonNullable<TextInputProps['onBlur']>;

/**
 * Input component following the 010-ui-components-migration spec
 *
 * Features:
 * - React 19 compatible (ref as regular prop, no forwardRef)
 * - Uses Uniwind className for styling
 * - Theme-aware placeholder color via CSS token
 * - Supports left/right addons
 * - Accessibility props included
 *
 * @example
 * <Input label="Email" placeholder="Enter email" value={email} onChangeText={setEmail} />
 */
export function Input({
  variant = 'default',
  size = 'default',
  label,
  error,
  hint,
  required,
  leftAddon,
  rightAddon,
  containerStyle,
  containerClassName,
  className,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
  onFocus,
  onBlur,
  ref,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const handleFocus = useCallback<FocusHandler>(
    (e) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback<BlurHandler>(
    (e) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const inputContainerClassName = getInputClassName(variant, size, hasError, isFocused);
  const textInputClassName = getTextInputClassName(size);
  const containerTestID = testID ? `${testID}-container` : undefined;
  const errorTestID = testID ? `${testID}-error` : undefined;

  // Derive accessibility label from label prop if not provided
  const inputAccessibilityLabel = accessibilityLabel ?? label;

  return (
    <View className={cn('mb-4', containerClassName)} style={containerStyle} testID={containerTestID}>
      {label ? <InputLabel label={label} required={required} /> : null}

      <InputFieldContainer
        className={inputContainerClassName}
        customClassName={className}
        leftAddon={leftAddon}
        rightAddon={rightAddon}
      >
        <TextInput
          ref={ref}
          className={textInputClassName}
          style={style}
          placeholderTextColor={PLACEHOLDER_COLOR}
          autoCapitalize="none"
          testID={testID}
          accessibilityLabel={inputAccessibilityLabel}
          accessibilityHint={accessibilityHint}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...textInputProps}
        />
      </InputFieldContainer>

      <InputHelperText hint={hint} error={error} testID={errorTestID} />
    </View>
  );
}

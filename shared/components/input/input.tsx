import React, { forwardRef, useCallback, useState } from 'react';
import { TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import { cn } from '@shared/utils';

import { InputFieldContainer } from './input-field';
import { InputHelperText } from './input-helper-text';
import { InputLabel } from './input-label';
import { InputProps } from './input.types';
import { getInputClassName, getTextInputClassName } from './input.utils';

type FocusHandler = NonNullable<TextInputProps['onFocus']>;
type BlurHandler = NonNullable<TextInputProps['onBlur']>;

/**
 * Input component following the 010-ui-components-migration spec
 *
 * @example
 * <Input label="Email" placeholder="Enter email" value={email} onChangeText={setEmail} />
 */
export const Input = forwardRef<TextInput, InputProps>(
  (
    {
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
      onFocus,
      onBlur,
      ...textInputProps
    },
    ref
  ) => {
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
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            testID={testID}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...textInputProps}
          />
        </InputFieldContainer>

        <InputHelperText hint={hint} error={error} testID={errorTestID} />
      </View>
    );
  }
);

Input.displayName = 'Input';

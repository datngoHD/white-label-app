import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { cn } from '@shared/utils';

import { ButtonContext } from './button-context';
import { ButtonProps } from './button.types';
import {
  getButtonClassName,
  getButtonTextClassName,
  getLoadingColor,
} from './button.utils';

/**
 * Button component following the 010-ui-components-migration spec
 *
 * Features:
 * - Uses Pressable (not TouchableOpacity) per Vercel RN Skills 9.9
 * - Uses Uniwind className for styling
 * - Supports compound pattern (ButtonText, ButtonIcon)
 * - Backward compatible with legacy `title` prop
 * - Theme-aware via CSS class tokens
 *
 * @example
 * // Compound pattern (recommended)
 * <Button onPress={handlePress}>
 *   <ButtonIcon><SaveIcon /></ButtonIcon>
 *   <ButtonText>Save</ButtonText>
 * </Button>
 *
 * @example
 * // Legacy pattern (backward compatible)
 * <Button title="Save" onPress={handlePress} />
 *
 * @example
 * // With variants and loading
 * <Button variant="destructive" loading={isDeleting}>
 *   <ButtonText>Delete</ButtonText>
 * </Button>
 */
export function Button({
  variant = 'default',
  size = 'default',
  loading = false,
  loadingText,
  fullWidth = false,
  disabled = false,
  className,
  children,
  title,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  ...pressableProps
}: ButtonProps) {
  // Using explicit check to satisfy both nullish-coalescing and boolean-literal rules
  const isDisabled = disabled ? true : loading;

  const buttonClassName = getButtonClassName(
    variant,
    size,
    fullWidth,
    isDisabled
  );
  const textClassName = getButtonTextClassName(variant, size);
  const loadingColor = getLoadingColor(variant);

  const contextValue = useMemo(
    () => ({
      variant,
      size,
      disabled: isDisabled,
      loading,
    }),
    [variant, size, isDisabled, loading]
  );

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator
            size="small"
            color={loadingColor}
            testID={testID ? `${testID}-loading` : undefined}
          />
          {loadingText ? (
            <Text className={textClassName}>{loadingText}</Text>
          ) : null}
        </>
      );
    }

    if (children) {
      return children;
    }

    if (title) {
      return <Text className={textClassName}>{title}</Text>;
    }

    return null;
  };

  const label = accessibilityLabel ?? title;

  return (
    <ButtonContext.Provider value={contextValue}>
      <Pressable
        className={cn(buttonClassName, className)}
        style={style}
        disabled={isDisabled}
        onPress={onPress}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled }}
        {...pressableProps}
      >
        {renderContent()}
      </Pressable>
    </ButtonContext.Provider>
  );
}

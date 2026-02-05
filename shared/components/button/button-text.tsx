import React from 'react';
import { Text } from 'react-native';

import { cn } from '@shared/utils';

import { useButtonContext } from './button-context';
import { ButtonTextProps } from './button.types';
import { getButtonTextClassName } from './button.utils';

export function ButtonText({ children, className }: ButtonTextProps) {
  const { variant, size } = useButtonContext();
  const textClassName = getButtonTextClassName(variant, size);

  return <Text className={cn(textClassName, className)}>{children}</Text>;
}

import React from 'react';
import { View } from 'react-native';

import { cn } from '@shared/utils';

import { useButtonContext } from './button-context';
import { ButtonIconProps } from './button.types';
import { getButtonIconClassName } from './button.utils';

export function ButtonIcon({ children, className }: ButtonIconProps) {
  const { variant, size } = useButtonContext();
  const iconClassName = getButtonIconClassName(variant, size);

  return <View className={cn(iconClassName, className)}>{children}</View>;
}

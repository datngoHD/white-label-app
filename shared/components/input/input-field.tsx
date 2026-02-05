import { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@shared/utils';

import { InputAddon } from './input-addon';

interface InputFieldContainerProps {
  className: string;
  customClassName?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  children: ReactNode;
}

export function InputFieldContainer({
  className,
  customClassName,
  leftAddon,
  rightAddon,
  children,
}: InputFieldContainerProps) {
  return (
    <View className={cn(className, customClassName)}>
      {leftAddon ? <InputAddon position="left">{leftAddon}</InputAddon> : null}
      {children}
      {rightAddon ? (
        <InputAddon position="right">{rightAddon}</InputAddon>
      ) : null}
    </View>
  );
}

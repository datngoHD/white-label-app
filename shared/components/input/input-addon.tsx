import { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@shared/utils';

import { getAddonClassName } from './input.utils';

interface InputAddonProps {
  children: ReactNode;
  position: 'left' | 'right';
}

export function InputAddon({ children, position }: InputAddonProps) {
  const positionClass = position === 'left' ? 'mr-2' : 'ml-2';

  return (
    <View className={cn(getAddonClassName(), positionClass)}>{children}</View>
  );
}

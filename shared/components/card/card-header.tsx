import { View } from 'react-native';

import { cn } from '@shared/utils';

import { CardHeaderProps } from './card.types';
import { getCardHeaderClassName } from './card.utils';

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <View className={cn(getCardHeaderClassName(), className)}>{children}</View>
  );
}

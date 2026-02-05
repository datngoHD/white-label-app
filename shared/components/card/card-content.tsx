import { View } from 'react-native';

import { cn } from '@shared/utils';

import { CardContentProps } from './card.types';
import { getCardContentClassName } from './card.utils';

export function CardContent({ children, className }: CardContentProps) {
  return (
    <View className={cn(getCardContentClassName(), className)}>{children}</View>
  );
}

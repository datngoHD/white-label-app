import { View } from 'react-native';

import { cn } from '@shared/utils';

import { CardActionProps } from './card.types';
import { getCardActionClassName } from './card.utils';

export function CardAction({ children, className }: CardActionProps) {
  return (
    <View className={cn(getCardActionClassName(), className)}>{children}</View>
  );
}

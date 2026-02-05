import { View } from 'react-native';

import { cn } from '@shared/utils';

import { CardFooterProps } from './card.types';
import { getCardFooterClassName } from './card.utils';

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <View className={cn(getCardFooterClassName(), className)}>{children}</View>
  );
}

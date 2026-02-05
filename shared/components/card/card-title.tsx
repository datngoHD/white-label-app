import { Text } from 'react-native';

import { cn } from '@shared/utils';

import { CardTitleProps } from './card.types';
import { getCardTitleClassName } from './card.utils';

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <Text className={cn(getCardTitleClassName(), className)}>{children}</Text>
  );
}

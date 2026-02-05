import { Text } from 'react-native';

import { cn } from '@shared/utils';

import { CardDescriptionProps } from './card.types';
import { getCardDescriptionClassName } from './card.utils';

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <Text className={cn(getCardDescriptionClassName(), className)}>
      {children}
    </Text>
  );
}

import { Pressable, View } from 'react-native';

import { cn } from '@shared/utils';

import { CardProps } from './card.types';
import { getCardClassName } from './card.utils';

/**
 * Card component following the 010-ui-components-migration spec
 *
 * Features:
 * - Uses Pressable for interactive cards (not TouchableOpacity)
 * - Uses Uniwind className for styling
 * - Supports compound pattern (CardHeader, CardContent, CardFooter, etc.)
 * - Supports variants (default, outlined, elevated)
 * - Theme-aware via CSS class tokens
 *
 * @example
 * // Basic card with compound components
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <Text>Card content goes here</Text>
 *   </CardContent>
 *   <CardFooter>
 *     <Button title="Action" />
 *   </CardFooter>
 * </Card>
 *
 * @example
 * // Interactive card
 * <Card onPress={handlePress} variant="elevated">
 *   <CardContent>
 *     <Text>Tap me</Text>
 *   </CardContent>
 * </Card>
 */
export function Card({
  variant = 'default',
  children,
  className,
  style,
  onPress,
  testID,
}: CardProps) {
  const cardClassName = getCardClassName(variant);

  // If onPress is provided, use Pressable for interactivity
  if (onPress) {
    return (
      <Pressable
        className={cn(cardClassName, className)}
        style={style}
        onPress={onPress}
        testID={testID}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    );
  }

  // Otherwise, use View for non-interactive cards
  return (
    <View className={cn(cardClassName, className)} style={style} testID={testID}>
      {children}
    </View>
  );
}

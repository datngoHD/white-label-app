import { Text } from 'react-native';

import { getHintClassName } from './input.utils';

interface InputHelperTextProps {
  hint?: string;
  error?: string;
  testID?: string;
}

/**
 * Renders either error message or hint text, with error taking priority
 */
export function InputHelperText({ hint, error, testID }: InputHelperTextProps) {
  if (error) {
    return (
      <Text className={getHintClassName(true)} testID={testID}>
        {error}
      </Text>
    );
  }

  if (hint) {
    return <Text className={getHintClassName(false)}>{hint}</Text>;
  }

  return null;
}

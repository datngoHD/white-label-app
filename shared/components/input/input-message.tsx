import { Text } from 'react-native';

import { getHintClassName } from './input.utils';

interface InputMessageProps {
  message: string;
  isError: boolean;
  testID?: string;
}

export function InputMessage({ message, isError, testID }: InputMessageProps) {
  return (
    <Text className={getHintClassName(isError)} testID={testID}>
      {message}
    </Text>
  );
}

import { Text } from 'react-native';

import { getLabelClassName } from './input.utils';

interface InputLabelProps {
  label: string;
  required?: boolean;
}

export function InputLabel({ label, required }: InputLabelProps) {
  return (
    <Text className={getLabelClassName()}>
      {label}
      {required ? <Text className="text-red-500"> *</Text> : null}
    </Text>
  );
}

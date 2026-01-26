import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
  padded?: boolean;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevated = true,
  padded = true,
  testID,
}) => {
  const cardStyle = [
    styles.card,
    elevated && styles.elevated,
    padded && styles.padded,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  padded: {
    padding: 16,
  },
});

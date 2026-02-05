import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  message,
  size = 'large',
  color = '#007AFF',
  fullScreen = false,
  overlay = false,
  style,
}) => {
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    overlay && styles.overlay,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
});

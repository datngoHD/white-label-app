import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useIsOffline } from '@core/hooks/useNetworkStatus';
import { useTheme } from '@core/theme';

import { Text } from '../Text/Text';

interface OfflineBannerProps {
  message?: string;
}

export function OfflineBanner({ message = 'No internet connection' }: OfflineBannerProps) {
  const theme = useTheme();
  const isOffline = useIsOffline();
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOffline ? 0 : -50,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOffline, slideAnim]);

  if (!isOffline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.warning,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>!</Text>
        </View>
        <Text style={[styles.message, { color: theme.colors.text.primary }]}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 44, // Safe area for iOS notch
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default OfflineBanner;

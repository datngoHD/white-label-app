import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from './providers/AppProviders';
import { bootstrap, markBootstrapped } from './bootstrap';
import { Loading } from '../shared/components';
import { RootNavigator } from '../core/navigation';

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await bootstrap();
        markBootstrapped();
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
      }
    };

    init();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="auto" />
        <Text style={styles.errorText}>Failed to initialize app</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <>
        <StatusBar style="auto" />
        <Loading fullScreen message="Loading..." />
      </>
    );
  }

  return (
    <AppProviders>
      <StatusBar style="auto" />
      <RootNavigator />
    </AppProviders>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ff3b30',
    marginBottom: 12,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default App;

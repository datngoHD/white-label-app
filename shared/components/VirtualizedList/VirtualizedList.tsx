import React, { useCallback, useMemo } from 'react';
import { FlatList, FlatListProps, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@core/theme';

import { Loading } from '../Loading/Loading';
import { Text } from '../Text/Text';

interface VirtualizedListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  itemHeight?: number;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  emptyMessage?: string;
  emptyComponent?: React.ReactElement;
  headerComponent?: React.ReactElement;
  footerComponent?: React.ReactElement;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  contentContainerStyle?: ViewStyle;
}

export function VirtualizedList<T>({
  data,
  renderItem,
  keyExtractor,
  itemHeight,
  isLoading = false,
  isLoadingMore = false,
  emptyMessage = 'No items found',
  emptyComponent,
  headerComponent,
  footerComponent,
  onEndReached,
  onEndReachedThreshold = 0.5,
  contentContainerStyle,
  ...props
}: VirtualizedListProps<T>): React.ReactElement {
  const theme = useTheme();

  const renderItemWrapper = useCallback(
    ({ item, index }: { item: T; index: number }) => renderItem(item, index),
    [renderItem]
  );

  const getItemLayout = useMemo(() => {
    if (!itemHeight) return undefined;
    return (_: unknown, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [itemHeight]);

  const ListEmptyComponent = useMemo(() => {
    if (isLoading) {
      return <Loading message="Loading..." />;
    }

    if (emptyComponent) {
      return emptyComponent;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  }, [isLoading, emptyComponent, emptyMessage, theme.colors.text.secondary]);

  const ListFooterComponent = useMemo(() => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingMore}>
          <Loading />
        </View>
      );
    }

    return footerComponent || null;
  }, [isLoadingMore, footerComponent]);

  const handleEndReached = useCallback(() => {
    if (!isLoading && !isLoadingMore && onEndReached) {
      onEndReached();
    }
  }, [isLoading, isLoadingMore, onEndReached]);

  return (
    <FlatList
      data={data}
      renderItem={renderItemWrapper}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      onEndReached={handleEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      contentContainerStyle={[data.length === 0 && styles.emptyList, contentContainerStyle]}
      // Performance optimizations
      removeClippedSubviews
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={21}
      initialNumToRender={10}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyList: {
    flexGrow: 1,
  },
  loadingMore: {
    padding: 16,
    alignItems: 'center',
  },
});

export default VirtualizedList;

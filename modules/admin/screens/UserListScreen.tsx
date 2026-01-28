import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';


import { AdminStackParamList } from '@core/navigation/types';
import { useTheme } from '@core/theme';
import { Button, Card, Input, Loading } from '@shared/components';
import { Header } from '@shared/components/Header/Header';
import { Text } from '@shared/components/Text/Text';

import { adminUserService } from '../services/adminUserService';
import { TenantUser } from '../types';

type Props = NativeStackScreenProps<AdminStackParamList, 'UserList'>;

export function UserListScreen({ navigation }: Props) {
  const theme = useTheme();
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
  });

  const fetchUsers = useCallback(
    async (page = 1, refresh = false) => {
      try {
        if (refresh) {
          setIsRefreshing(true);
        } else if (page === 1) {
          setIsLoading(true);
        }
        setError(null);

        const response = await adminUserService.getUsers({
          page,
          limit: 20,
          search: search || undefined,
        });

        if (page === 1) {
          setUsers(response.data);
        } else {
          setUsers((prev) => [...prev, ...response.data]);
        }
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [search]
  );

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const handleRefresh = () => {
    fetchUsers(1, true);
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !isLoading) {
      fetchUsers(pagination.page + 1);
    }
  };

  const handleUserPress = (user: TenantUser) => {
    navigation.navigate('UserDetail', { userId: user.id });
  };

  const handleInviteUser = () => {
    navigation.navigate('InviteUser');
  };

  const renderUser = ({ item }: { item: TenantUser }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <Card style={styles.userCard}>
        <View style={styles.userRow}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: item.isActive ? theme.colors.primary : theme.colors.text.secondary,
              },
            ]}
          >
            <Text style={styles.avatarText}>
              {item.firstName[0]}
              {item.lastName[0]}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={[styles.userEmail, { color: theme.colors.text.secondary }]}>
              {item.email}
            </Text>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{item.role}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: item.isActive
                      ? theme.colors.success + '20'
                      : theme.colors.error + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: item.isActive ? theme.colors.success : theme.colors.error,
                    },
                  ]}
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading && users.length === 0) {
    return <Loading message="Loading users..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="User Management" />

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search users..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <Button title="Invite User" onPress={handleInviteUser} style={styles.inviteButton} />
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '10' }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          <Button title="Retry" onPress={() => fetchUsers(1)} variant="text" />
        </View>
      )}

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              No users found
            </Text>
          </View>
        }
        ListFooterComponent={
          pagination.hasMore ? (
            <View style={styles.loadingMore}>
              <Loading />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
  },
  inviteButton: {
    flexShrink: 0,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  userCard: {
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  loadingMore: {
    padding: 16,
    alignItems: 'center',
  },
});

export default UserListScreen;

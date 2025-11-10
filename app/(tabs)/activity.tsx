import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetUserActivity, useGetCurrentUser } from '../../services/convex';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/theme';

const formatTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
};

export default function Activity() {
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = useGetCurrentUser(user?.clerkId || '');
  const activities = useGetUserActivity(currentUser?._id);

  const renderActivityItem = ({ item }: { item: any }) => {
    const getActivityText = () => {
      switch (item.type) {
        case 'like':
          return 'liked your post';
        default:
          return '';
      }
    };

    const getActivityIcon = () => {
      switch (item.type) {
        case 'like':
          return <Ionicons name="heart" size={16} color={Colors.like} />;
        default:
          return null;
      }
    };

    return (
      <TouchableOpacity style={styles.activityItem}>
        <View style={styles.activityLeft}>
          <View style={styles.activityAvatar}>
            <Text style={styles.avatarText}>{item.user?.name?.[0] || '?'}</Text>
          </View>
          <View style={styles.activityIconContainer}>
            {getActivityIcon()}
          </View>
        </View>
        
        <View style={styles.activityContent}>
          <Text style={styles.activityText}>
            <Text style={styles.username}>
              {item.user?._id === currentUser?._id ? 'You' : (item.user?.name || 'Unknown')}
            </Text>
            <Text style={styles.actionText}> {getActivityText()}</Text>
          </Text>
          <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
        </View>

        {item.post?.image && (
          <Image source={{ uri: item.post.image }} style={styles.postThumbnail} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      {/* Activity List */}
      <FlatList
        data={activities || []}
        keyExtractor={(item) => item.id}
        renderItem={renderActivityItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptySubtitle}>When people interact with your posts, you'll see it here</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  listContainer: {
    paddingVertical: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  activityLeft: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  activityAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  activityIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    padding: 4,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: 2,
  },
  username: {
    fontWeight: '600',
  },
  actionText: {
    color: Colors.textSecondary,
  },
  timeText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  postThumbnail: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
  },
  followButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  followButtonText: {
    ...Typography.captionMedium,
    color: Colors.text,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
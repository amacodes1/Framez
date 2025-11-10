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
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/theme';

const mockActivities = [
  {
    id: '1',
    type: 'like',
    user: 'sarah_j',
    avatar: 'https://picsum.photos/100/100?random=20',
    time: '2m',
    postImage: 'https://picsum.photos/200/200?random=21',
  },
  {
    id: '2',
    type: 'follow',
    user: 'mike_dev',
    avatar: 'https://picsum.photos/100/100?random=22',
    time: '5m',
  },
  {
    id: '3',
    type: 'comment',
    user: 'emma_wilson',
    avatar: 'https://picsum.photos/100/100?random=23',
    time: '10m',
    comment: 'Amazing shot! 📸',
    postImage: 'https://picsum.photos/200/200?random=24',
  },
  {
    id: '4',
    type: 'like',
    user: 'alex_chen',
    avatar: 'https://picsum.photos/100/100?random=25',
    time: '1h',
    postImage: 'https://picsum.photos/200/200?random=26',
  },
];

export default function Activity() {
  const renderActivityItem = ({ item }: { item: any }) => {
    const getActivityText = () => {
      switch (item.type) {
        case 'like':
          return 'liked your post';
        case 'follow':
          return 'started following you';
        case 'comment':
          return `commented: ${item.comment}`;
        default:
          return '';
      }
    };

    const getActivityIcon = () => {
      switch (item.type) {
        case 'like':
          return <Ionicons name="heart" size={16} color={Colors.like} />;
        case 'follow':
          return <Ionicons name="person-add" size={16} color={Colors.secondary} />;
        case 'comment':
          return <Ionicons name="chatbubble" size={16} color={Colors.textMuted} />;
        default:
          return null;
      }
    };

    return (
      <TouchableOpacity style={styles.activityItem}>
        <View style={styles.activityLeft}>
          <Image source={{ uri: item.avatar }} style={styles.activityAvatar} />
          <View style={styles.activityIconContainer}>
            {getActivityIcon()}
          </View>
        </View>
        
        <View style={styles.activityContent}>
          <Text style={styles.activityText}>
            <Text style={styles.username}>{item.user}</Text>
            <Text style={styles.actionText}> {getActivityText()}</Text>
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        {item.postImage && (
          <Image source={{ uri: item.postImage }} style={styles.postThumbnail} />
        )}

        {item.type === 'follow' && (
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
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
        data={mockActivities}
        keyExtractor={(item) => item.id}
        renderItem={renderActivityItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
});
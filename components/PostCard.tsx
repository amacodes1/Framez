import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';
import { formatTimestamp } from '../utils/helpers';

interface Post {
  _id: string;
  content: string;
  image?: string;
  createdAt: number;
  author: {
    name: string;
    avatar?: string;
  };
}

interface PostCardProps {
  post: Post;
}

const { width } = Dimensions.get('window');

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 1000));

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            {post.author.avatar ? (
              <Image source={{ uri: post.author.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{post.author.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.storyRing} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{post.author.name}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(post.createdAt)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {post.content && (
        <Text style={styles.content}>{post.content}</Text>
      )}
      
      {/* Image */}
      {post.image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: post.image }} style={styles.postImage} />
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons 
              name={liked ? "heart" : "heart-outline"} 
              size={24} 
              color={liked ? Colors.like : Colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setBookmarked(!bookmarked)}>
          <Ionicons 
            name={bookmarked ? "bookmark" : "bookmark-outline"} 
            size={22} 
            color={bookmarked ? Colors.text : Colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Likes count */}
      <Text style={styles.likesCount}>{likesCount.toLocaleString()} likes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  storyRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  timestamp: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 2,
  },
  moreButton: {
    padding: Spacing.sm,
  },
  content: {
    ...Typography.body,
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  imageContainer: {
    marginBottom: Spacing.md,
  },
  postImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: Spacing.lg,
    padding: Spacing.xs,
  },
  likesCount: {
    ...Typography.captionMedium,
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
  },
});
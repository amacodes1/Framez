import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Share,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { formatTimestamp } from '../utils/helpers';
import { useToggleLike, useGetPostLikes, useIsPostLiked, useGetCurrentUser, useDeletePost, useEditPost } from '../services/convex';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Id } from '../convex/_generated/dataModel';
import { EditPost } from './EditPost';

interface Post {
  _id: Id<"posts">;
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

export const PostCard: React.FC<PostCardProps> = React.memo(({ post }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = useGetCurrentUser(user?.clerkId || '');
  const [bookmarked, setBookmarked] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  
  const toggleLike = useToggleLike();
  const deletePost = useDeletePost();
  const editPost = useEditPost();
  const likesCount = useGetPostLikes(post._id) || 0;
  const isLiked = useIsPostLiked(currentUser?._id, post._id) || false;
  
  const isOwnPost = currentUser?.clerkId === post.author.name || currentUser?.name === post.author.name;

  const handleLike = async () => {
    if (!currentUser?._id) return;
    
    try {
      await toggleLike({
        userId: currentUser._id,
        postId: post._id,
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!currentUser?._id) return;
            
            try {
              await deletePost({
                postId: post._id,
                userId: currentUser._id,
              });
              Alert.alert('Success', 'Post deleted successfully');
            } catch {
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const handleEditPost = async (content: string, image?: string) => {
    if (!currentUser?._id) return;
    
    try {
      await editPost({
        postId: post._id,
        userId: currentUser._id,
        content,
        image,
      });
      Alert.alert('Success', 'Post updated successfully! ✨');
    } catch {
      Alert.alert('Error', 'Failed to update post');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post by ${post.author.name} on Framez:\n\n${post.content}\n\nhttps://framez.app/post/${post._id}`,
        title: 'Share Post',
        url: `https://framez.app/post/${post._id}`,
      });
    } catch {
      Alert.alert('Error', 'Failed to share post');
    }
  };

  const handleMoreOptions = () => {
    if (isOwnPost) {
      Alert.alert(
        'Post Options',
        'What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Edit Post',
            onPress: () => setShowEditPost(true),
          },
          {
            text: 'Delete Post',
            style: 'destructive',
            onPress: handleDelete,
          },
        ]
      );
    }
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
        <TouchableOpacity style={styles.moreButton} onPress={handleMoreOptions}>
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
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked ? Colors.like : Colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
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
      
      <EditPost
        visible={showEditPost}
        onClose={() => setShowEditPost(false)}
        onSubmit={handleEditPost}
        initialContent={post.content}
        initialImage={post.image}
      />
    </View>
  );
});

PostCard.displayName = 'PostCard';

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
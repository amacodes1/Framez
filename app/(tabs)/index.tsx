import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PostCard } from '../../components/PostCard';
import { CreatePost } from '../../components/CreatePost';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';
import { useGetAllPosts, useCreatePost, useGetCurrentUser } from '../../services/convex';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// Posts are now loaded from Convex database

export default function Feed() {
  const { user } = useSelector((state: RootState) => state.auth);
  const posts = useGetAllPosts() || [];
  const createPost = useCreatePost();
  const currentUser = useGetCurrentUser(user?.id || '');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCreatePost = async (content: string, image?: string) => {
    if (!currentUser?._id) return;
    
    try {
      await createPost({
        userId: currentUser._id,
        content,
        ...(image && { image }),
      });
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const renderHeader = () => (
    <View style={styles.storiesContainer}>
      <Text style={styles.storiesTitle}>Stories</Text>
      <View style={styles.storiesRow}>
        {/* Your story */}
        <TouchableOpacity style={styles.storyItem}>
          <View style={styles.addStoryContainer}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientMiddle, Colors.gradientEnd]}
              style={styles.addStoryGradient}
            >
              <Ionicons name="add" size={24} color={Colors.text} />
            </LinearGradient>
          </View>
          <Text style={styles.storyLabel}>Your Story</Text>
        </TouchableOpacity>

        {/* Mock stories */}
        {['Emma', 'Alex', 'Mike', 'Sarah'].map((name, index) => (
          <TouchableOpacity key={index} style={styles.storyItem}>
            <View style={styles.storyRing}>
              <View style={styles.storyAvatar}>
                <Text style={styles.storyAvatarText}>{name[0]}</Text>
              </View>
            </View>
            <Text style={styles.storyLabel}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientMiddle, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.logoGradient}
        >
          <Text style={styles.logo}>Framez</Text>
        </LinearGradient>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="chatbubble-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts.filter(post => post.author).map(post => ({
          ...post,
          author: {
            name: post.author!.name,
            avatar: post.author!.avatar
          }
        }))}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to share something!</Text>
          </View>
        }
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.feed}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreatePost(true)}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientMiddle, Colors.gradientEnd]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color={Colors.text} />
        </LinearGradient>
      </TouchableOpacity>

      <CreatePost
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  logo: {
    ...Typography.h2,
    color: Colors.text,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.md,
  },
  storiesContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  storiesTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  storiesRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: Spacing.lg,
    width: 70,
  },
  addStoryContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  addStoryGradient: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.full,
    padding: 2,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatarText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  storyLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  feed: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    ...Shadows.large,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
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
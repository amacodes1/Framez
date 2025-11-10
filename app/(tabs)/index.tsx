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

// Mock data for posts
const mockPosts = [
  {
    _id: '1',
    content: 'Just had an amazing day at the beach! The sunset was absolutely breathtaking 🏖️✨',
    image: 'https://picsum.photos/400/400?random=1',
    createdAt: Date.now() - 3600000,
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://picsum.photos/100/100?random=1',
    },
  },
  {
    _id: '2',
    content: 'Working on some exciting new projects. Innovation never stops! Can\'t wait to share more details soon 🚀',
    createdAt: Date.now() - 7200000,
    author: {
      name: 'Alex Chen',
    },
  },
  {
    _id: '3',
    content: 'Beautiful morning vibes ☀️',
    image: 'https://picsum.photos/400/400?random=2',
    createdAt: Date.now() - 10800000,
    author: {
      name: 'Mike Rodriguez',
      avatar: 'https://picsum.photos/100/100?random=2',
    },
  },
  {
    _id: '4',
    content: 'Coffee and code - the perfect combination for a productive day! ☕️💻',
    image: 'https://picsum.photos/400/400?random=3',
    createdAt: Date.now() - 14400000,
    author: {
      name: 'Emma Wilson',
      avatar: 'https://picsum.photos/100/100?random=3',
    },
  },
];

export default function Feed() {
  const [posts, setPosts] = useState(mockPosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCreatePost = (content: string, image?: string) => {
    const newPost: any = {
      _id: Date.now().toString(),
      content,
      ...(image && { image }),
      createdAt: Date.now(),
      author: {
        name: 'You',
      },
    };
    setPosts([newPost, ...posts]);
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
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={renderHeader}
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
});
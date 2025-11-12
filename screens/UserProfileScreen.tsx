import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { PostCard } from '../components/PostCard';
import { useGetCurrentUser } from '../services/convex';

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams();
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const currentUser = useGetCurrentUser(authUser?.clerkId || '');
  
  const user = useQuery(api.users.getUserByName, { name: userId as string });
  const userPosts = useQuery(api.posts.getUserPosts, user?._id ? { userId: user._id } : "skip");
  const followCounts = useQuery(api.follows.getFollowCounts, user?._id ? { userId: user._id } : "skip");
  const isFollowing = useQuery(api.follows.isFollowing, 
    currentUser?._id && user?._id ? {
      followerId: currentUser._id,
      followingId: user._id,
    } : "skip"
  );
  
  const followUser = useMutation(api.follows.followUser);

  const handleFollow = async () => {
    if (!currentUser?._id || !user?._id) return;
    await followUser({
      followerId: currentUser._id,
      followingId: user._id,
    });
  };

  if (!user) return null;

  const isOwnProfile = currentUser?._id === user._id;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.username}>{user.name}</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: user.avatar || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userPosts?.length || 0}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{followCounts?.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{followCounts?.following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {!isOwnProfile && (
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={handleFollow}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>Posts</Text>
        {userPosts?.map((post) => (
          <PostCard key={post._id} post={{
            ...post,
            author: {
              name: user.name,
              avatar: user.avatar
            }
          }} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  followButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  followingButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: Colors.text,
  },
  postsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
});
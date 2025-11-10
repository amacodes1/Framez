import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Dimensions,
  Image,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootState } from '../../store';
import { clearUser } from '../../store/authSlice';
import { AuthService } from '../../services/auth';
import { PostCard } from '../../components/PostCard';
import { CreatePost } from '../../components/CreatePost';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';
import { useGetCurrentUser, useGetUserPosts, useUpdateUser, useGetFollowersCount, useGetFollowingCount, useCreatePost } from '../../services/convex';
import { EditProfile } from '../../components/EditProfile';

const { width } = Dimensions.get('window');


export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = useGetCurrentUser(user?.clerkId || '');
  const userPosts = useGetUserPosts(currentUser?._id) || [];
  const followersCount = useGetFollowersCount(currentUser?._id) || 0;
  const followingCount = useGetFollowingCount(currentUser?._id) || 0;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const updateUser = useUpdateUser();
  const createPost = useCreatePost();

  const handleEditProfile = async (name: string, email: string, avatar?: string, bio?: string) => {
    if (!currentUser?._id) return;
    
    try {
      await updateUser({
        userId: currentUser._id,
        name,
        email,
        avatar,
        bio,
      });
      Alert.alert('Success', 'Profile updated successfully! ✨');
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCreatePost = async (content: string, image?: string) => {
    if (!currentUser?._id) return;
    
    try {
      await createPost({
        userId: currentUser._id,
        content,
        ...(image && { image }),
      });
      Alert.alert('Success', 'Post created successfully! 🎉');
    } catch {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${currentUser?.name}'s profile on Framez!\n\n${userPosts.length} posts • ${followersCount} followers • ${followingCount} following\n\nhttps://framez.app/profile/${currentUser?._id}`,
        title: 'Share Profile',
        url: `https://framez.app/profile/${currentUser?._id}`,
      });
    } catch {
      Alert.alert('Error', 'Failed to share profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            dispatch(clearUser());
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const renderGridItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity style={styles.gridItem}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.gridImage} />
      ) : (
        <View style={styles.gridTextPost}>
          <Text style={styles.gridText} numberOfLines={3}>
            {item.content}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientMiddle, Colors.gradientEnd]}
            style={styles.avatarGradient}
          >
            <View style={styles.avatar}>
              {currentUser?.avatar ? (
                <Image source={{ uri: currentUser.avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{currentUser?.name?.charAt(0).toUpperCase()}</Text>
              )}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* User Details */}
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{currentUser?.name}</Text>
        {currentUser?.bio ? (
          <Text style={styles.userBio}>{currentUser.bio}</Text>
        ) : (
          <Text style={styles.userBioPlaceholder}>Add a bio to tell people about yourself</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => setShowEditProfile(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
          <Ionicons name="share-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Highlights */}
      <View style={styles.highlights}>
        <Text style={styles.highlightsTitle}>Story Highlights</Text>
        <View style={styles.highlightsList}>
          {['Travel', 'Food', 'Work', 'Friends'].map((highlight, index) => (
            <TouchableOpacity key={index} style={styles.highlightItem}>
              <View style={styles.highlightCircle}>
                <Ionicons name="images-outline" size={24} color={Colors.textMuted} />
              </View>
              <Text style={styles.highlightLabel}>{highlight}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'grid' && styles.toggleButtonActive]}
          onPress={() => setViewMode('grid')}
        >
          <Ionicons 
            name="grid-outline" 
            size={20} 
            color={viewMode === 'grid' ? Colors.text : Colors.textMuted} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Ionicons 
            name="list-outline" 
            size={20} 
            color={viewMode === 'list' ? Colors.text : Colors.textMuted} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{currentUser?.name || user?.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="add-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="menu-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'grid' ? (
        <FlatList
          key="grid"
          data={userPosts}
          keyExtractor={(item) => item._id}
          renderItem={renderGridItem}
          numColumns={3}
          ListHeaderComponent={renderProfileHeader}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="camera-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No posts yet</Text>
              <Text style={styles.emptySubtitle}>Share your first post!</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <FlatList
          key="list"
          data={userPosts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PostCard post={{
            ...item,
            author: {
              name: currentUser?.name || 'You',
              avatar: currentUser?.avatar
            }
          }} />}
          ListHeaderComponent={renderProfileHeader}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="camera-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No posts yet</Text>
              <Text style={styles.emptySubtitle}>Share your first post!</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
      
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
      
      <EditProfile
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSubmit={handleEditProfile}
        initialName={currentUser?.name || ''}
        initialEmail={currentUser?.email || ''}
        initialAvatar={currentUser?.avatar}
        initialBio={currentUser?.bio}
      />
      
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
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.md,
  },
  profileHeader: {
    backgroundColor: Colors.surface,
    paddingBottom: Spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  avatarSection: {
    marginRight: Spacing.xl,
  },
  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.full,
    padding: 3,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 82,
    height: 82,
    borderRadius: BorderRadius.full,
  },
  avatarText: {
    ...Typography.h1,
    color: Colors.text,
  },
  statsSection: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h3,
    color: Colors.text,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userDetails: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  userName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  userBio: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  userBioPlaceholder: {
    ...Typography.body,
    color: Colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  editButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  shareButton: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  highlights: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  highlightsTitle: {
    ...Typography.captionMedium,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  highlightsList: {
    flexDirection: 'row',
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: Spacing.lg,
    width: 70,
  },
  highlightCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  highlightLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  toggleButtonActive: {
    borderBottomColor: Colors.primary,
  },
  gridContainer: {
    paddingBottom: Spacing.xl,
  },
  gridItem: {
    width: (width - 4) / 3,
    height: (width - 4) / 3,
    margin: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridTextPost: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.sm,
    justifyContent: 'center',
  },
  gridText: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
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
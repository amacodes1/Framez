import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PostCard } from '../../components/PostCard';
import { CreatePost } from '../../components/CreatePost';

// Mock data for posts
const mockPosts = [
  {
    _id: '1',
    content: 'Just had an amazing day at the beach! 🏖️',
    image: 'https://picsum.photos/400/300?random=1',
    createdAt: Date.now() - 3600000,
    author: {
      name: 'John Doe',
      avatar: 'https://picsum.photos/100/100?random=1',
    },
  },
  {
    _id: '2',
    content: 'Working on some exciting new projects. Can\'t wait to share more details soon!',
    createdAt: Date.now() - 7200000,
    author: {
      name: 'Jane Smith',
    },
  },
  {
    _id: '3',
    content: 'Beautiful sunset tonight 🌅',
    image: 'https://picsum.photos/400/300?random=2',
    createdAt: Date.now() - 10800000,
    author: {
      name: 'Mike Johnson',
      avatar: 'https://picsum.photos/100/100?random=2',
    },
  },
];

export default function Feed() {
  const [posts, setPosts] = useState(mockPosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCreatePost = (content: string, image?: string) => {
    const newPost = {
      _id: Date.now().toString(),
      content,
      image,
      createdAt: Date.now(),
      author: {
        name: 'Current User',
      },
    };
    setPosts([newPost, ...posts]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Framez</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreatePost(true)}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard post={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  createButton: {
    padding: 8,
  },
});
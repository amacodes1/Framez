import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useGetCurrentUser } from '../services/convex';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  postId: Id<"posts">;
}

export default function CommentModal({ visible, onClose, postId }: CommentModalProps) {
  const [comment, setComment] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = useGetCurrentUser(user?.clerkId || '');
  
  const comments = useQuery(api.comments.getCommentsByPost, { postId });
  const createComment = useMutation(api.comments.createComment);

  const handleSubmit = async () => {
    if (!comment.trim() || !currentUser?._id) return;
    
    await createComment({
      postId,
      userId: currentUser._id,
      content: comment.trim(),
    });
    
    setComment('');
  };

  const renderComment = ({ item }: { item: any }) => (
    <View style={styles.comment}>
      <Image
        source={{ uri: item.user?.avatar || 'https://via.placeholder.com/40' }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUser}>{item.user?.name || 'Unknown User'}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentTime}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item._id}
          style={styles.commentsList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={Colors.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !comment.trim() && styles.sendButtonDisabled]}
            onPress={handleSubmit}
            disabled={!comment.trim()}
          >
            <Ionicons name="send" size={20} color={comment.trim() ? Colors.primary : Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  commentsList: {
    flex: 1,
    padding: 16,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  commentText: {
    color: Colors.text,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    color: Colors.text,
  },
  sendButton: {
    padding: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
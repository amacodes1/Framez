import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useGetCurrentUser, useDeleteComment, useToggleCommentLike, useGetCommentLikes, useIsCommentLiked } from '../services/convex';

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
  const deleteComment = useDeleteComment();
  const toggleCommentLike = useToggleCommentLike();

  const handleSubmit = async () => {
    if (!comment.trim() || !currentUser?._id) return;
    
    await createComment({
      postId,
      userId: currentUser._id,
      content: comment.trim(),
    });
    
    setComment('');
  };

  const CommentItem = React.memo(({ item }: { item: any }) => {
    const likesCount = useGetCommentLikes(item._id) || 0;
    const isLiked = useIsCommentLiked(currentUser?._id, item._id) || false;
    const isOwnComment = currentUser?._id === item.userId;

    const handleLike = async () => {
      if (!currentUser?._id) return;
      await toggleCommentLike({
        commentId: item._id,
        userId: currentUser._id,
      });
    };

    const handleDelete = () => {
      Alert.alert(
        'Delete Comment',
        'Are you sure you want to delete this comment?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              if (!currentUser?._id) return;
              await deleteComment({
                commentId: item._id,
                userId: currentUser._id,
              });
            },
          },
        ]
      );
    };

    return (
      <View style={styles.comment}>
        <Image
          source={{ uri: item.user?.avatar || 'https://via.placeholder.com/40' }}
          style={styles.commentAvatar}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUser}>{item.user?.name || 'Unknown User'}</Text>
            {isOwnComment && (
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.commentText}>{item.content}</Text>
          <View style={styles.commentActions}>
            <Text style={styles.commentTime}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={14} 
                color={isLiked ? Colors.like : Colors.textMuted} 
              />
              {likesCount > 0 && <Text style={styles.likeCount}>{likesCount}</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  });
  
  CommentItem.displayName = 'CommentItem';

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
          renderItem={({ item }) => <CommentItem item={item} />}
          keyExtractor={(item) => item._id}
          style={styles.commentsList}
          keyboardShouldPersistTaps="handled"
        />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
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
        </KeyboardAvoidingView>
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
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  deleteButton: {
    padding: 4,
  },
  commentText: {
    color: Colors.text,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  likeCount: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
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
    maxHeight: 150,
    color: Colors.text,
  },
  sendButton: {
    padding: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
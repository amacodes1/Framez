import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { convertImageToBase64 } from '../utils/imageUtils';

interface CreatePostProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, image?: string) => void;
}

const { width } = Dimensions.get('window');

export const CreatePost: React.FC<CreatePostProps> = ({ visible, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const base64Image = await convertImageToBase64(result.assets[0].uri);
        setImage(base64Image);
      } catch (error) {
        console.error('Error converting image:', error);
        setImage(result.assets[0].uri);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const base64Image = await convertImageToBase64(result.assets[0].uri);
        setImage(base64Image);
      } catch (error) {
        console.error('Error converting image:', error);
        setImage(result.assets[0].uri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) {
      Alert.alert('Error', 'Please add some content or an image to your post');
      return;
    }

    setIsPosting(true);
    
    try {
      onSubmit(content, image || undefined);
      setContent('');
      setImage(null);
      setIsPosting(false);
      onClose();
    } catch (error) {
      console.error('Error posting:', error);
      Alert.alert('Error', 'Failed to create post');
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    if (content.trim() || image) {
      Alert.alert(
        'Discard post?',
        'Are you sure you want to discard this post?',
        [
          { text: 'Keep editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setContent('');
              setImage(null);
              onClose();
            }
          }
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.title}>New Post</Text>
          
          <TouchableOpacity 
            onPress={handleSubmit} 
            style={[styles.postButton, (!content.trim() && !image) && styles.postButtonDisabled]}
            disabled={(!content.trim() && !image) || isPosting}
          >
            {isPosting ? (
              <Text style={styles.postButtonText}>Posting...</Text>
            ) : (
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientMiddle, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.postButtonText}>Share</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User info */}
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>U</Text>
            </View>
            <Text style={styles.username}>Your Story</Text>
          </View>

          {/* Text input */}
          <TextInput
            style={styles.textInput}
            placeholder="What's happening?"
            placeholderTextColor={Colors.textMuted}
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
            maxLength={280}
          />

          {/* Character count */}
          <Text style={styles.characterCount}>{content.length}/280</Text>

          {/* Selected image */}
          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <Ionicons name="close-circle" size={28} color={Colors.text} />
              </TouchableOpacity>
            </View>
          )}

          {/* Media options */}
          <View style={styles.mediaOptions}>
            <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
              <View style={styles.mediaIconContainer}>
                <Ionicons name="images" size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.mediaButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
              <View style={styles.mediaIconContainer}>
                <Ionicons name="camera" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.mediaButtonText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaButton}>
              <View style={styles.mediaIconContainer}>
                <Ionicons name="location" size={24} color={Colors.success} />
              </View>
              <Text style={styles.mediaButtonText}>Location</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
  },
  postButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  gradientButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  postButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    ...Typography.h3,
    color: Colors.text,
  },
  username: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  textInput: {
    ...Typography.body,
    color: Colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
  },
  characterCount: {
    ...Typography.small,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: width - (Spacing.lg * 2),
    borderRadius: BorderRadius.lg,
  },
  removeImageButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
  },
  mediaOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.lg,
  },
  mediaButton: {
    alignItems: 'center',
    flex: 1,
  },
  mediaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  mediaButtonText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
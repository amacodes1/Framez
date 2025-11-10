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
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface EditPostProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, image?: string) => void;
  initialContent: string;
  initialImage?: string;
}

const { width } = Dimensions.get('window');

export const EditPost: React.FC<EditPostProps> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  initialContent, 
  initialImage 
}) => {
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUpdating, setIsUpdating] = useState(false);

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
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    setIsUpdating(true);
    
    setTimeout(() => {
      onSubmit(content, image || undefined);
      setIsUpdating(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setContent(initialContent);
    setImage(initialImage || null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Edit Post</Text>
          
          <TouchableOpacity 
            onPress={handleSubmit} 
            style={[styles.updateButton, !content.trim() && styles.updateButtonDisabled]}
            disabled={!content.trim() || isUpdating}
          >
            {isUpdating ? (
              <Text style={styles.updateButtonText}>Updating...</Text>
            ) : (
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientMiddle, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            placeholderTextColor={Colors.textMuted}
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
            maxLength={280}
          />

          <Text style={styles.characterCount}>{content.length}/280</Text>

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

          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Ionicons name="images" size={24} color={Colors.secondary} />
            <Text style={styles.imagePickerText}>Change Photo</Text>
          </TouchableOpacity>
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
  updateButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  updateButtonDisabled: {
    opacity: 0.5,
  },
  gradientButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  updateButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  textInput: {
    ...Typography.body,
    color: Colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    marginTop: Spacing.lg,
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
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  imagePickerText: {
    marginLeft: Spacing.md,
    ...Typography.body,
    color: Colors.secondary,
  },
});
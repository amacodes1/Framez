import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

export const PostSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };
    shimmer();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Animated.View style={[styles.avatar, { opacity: shimmerOpacity }]} />
        <View style={styles.headerText}>
          <Animated.View style={[styles.name, { opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.time, { opacity: shimmerOpacity }]} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.textLine, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.textLineShort, { opacity: shimmerOpacity }]} />
      </View>

      {/* Image placeholder */}
      <Animated.View style={[styles.image, { opacity: shimmerOpacity }]} />

      {/* Actions */}
      <View style={styles.actions}>
        <Animated.View style={[styles.actionButton, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.actionButton, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.actionButton, { opacity: shimmerOpacity }]} />
      </View>
    </View>
  );
};

export const SkeletonLoader = ({ count = 3 }: { count?: number }) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  name: {
    height: 16,
    width: 120,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  time: {
    height: 12,
    width: 80,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
  },
  content: {
    marginBottom: Spacing.md,
  },
  textLine: {
    height: 14,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  textLineShort: {
    height: 14,
    width: '70%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
  },
  image: {
    height: 200,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 60,
    height: 20,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.lg,
  },
});
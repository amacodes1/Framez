import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { setUser } from '../store/authSlice';
import { AuthService } from '../services/auth';
import { validateEmail } from '../utils/validation';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.login(email, password);
      dispatch(setUser(result.user));
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientMiddle, Colors.gradientEnd]}
              style={styles.logoContainer}
            >
              <Ionicons name="camera" size={40} color={Colors.text} />
            </LinearGradient>
            <Text style={styles.appName}>Framez</Text>
            <Text style={styles.tagline}>Share your moments</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Welcome back!</Text>
            <Text style={styles.formSubtitle}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={Colors.textMuted} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientMiddle, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Loading...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchSection}>
            <Text style={styles.switchText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.switchButton}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl * 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  appName: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  formSection: {
    marginBottom: Spacing.xxxl,
  },
  formTitle: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  formSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    ...Shadows.small,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: Spacing.lg,
  },
  passwordInput: {
    paddingRight: Spacing.xl,
  },
  eyeIcon: {
    position: 'absolute',
    right: Spacing.lg,
    padding: Spacing.sm,
  },
  submitButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.lg,
    ...Shadows.medium,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  forgotPasswordText: {
    ...Typography.caption,
    color: Colors.secondary,
  },
  switchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  switchText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  switchButton: {
    ...Typography.bodyMedium,
    color: Colors.primary,
  },
});
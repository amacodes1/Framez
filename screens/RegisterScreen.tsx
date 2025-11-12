import React, { useState, useEffect } from 'react';
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

import { validateEmail, validatePassword } from '../utils/validation';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  const dispatch = useDispatch();
  const router = useRouter();

  
  useEffect(() => {
    if (password) {
      const validation = validatePassword(password);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
    }
  }, [password]);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Email existence check is now handled in AuthService
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert('Error', 'Password must meet all requirements');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await AuthService.register(name, email, password);
      Alert.alert('Success', 'Account created successfully! Please sign in.', [
        { text: 'OK', onPress: () => router.push('/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
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
            <Text style={styles.formTitle}>Join Framez</Text>
            <Text style={styles.formSubtitle}>Create your account to get started</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

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

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Confirm Password"
                placeholderTextColor={Colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={Colors.textMuted} 
                />
              </TouchableOpacity>
            </View>
            
            {passwordErrors.length > 0 && (
              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>Password must have:</Text>
                {passwordErrors.map((error, index) => (
                  <Text key={index} style={styles.requirementText}>• {error}</Text>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientMiddle, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Loading...' : 'Sign Up'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.switchSection}>
            <Text style={styles.switchText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.switchButton}>Sign In</Text>
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
  passwordRequirements: {
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  requirementsTitle: {
    ...Typography.caption,
    color: Colors.text,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  requirementText: {
    ...Typography.small,
    color: Colors.textMuted,
    marginBottom: 2,
  },
});
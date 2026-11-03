import { useAuth } from '@/context/AuthContext';
import { colors, globalStyles } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
    const { login, quickDemoLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Validation Error', 'Please enter your email and password.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        try {
            setIsSubmitting(true);
            await login(email, password);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/(tabs)/profile');
            }
        } catch (error: any) {
            Alert.alert('Login Failed', error?.message || 'Unable to sign in.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDemoLogin = async () => {
        try {
            setIsSubmitting(true);
            await quickDemoLogin();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/(tabs)/profile');
            }
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to sign in demo user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps='handled'
            >
                <View style={styles.topBar}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/(tabs)');
                            }
                        }}
                    >
                        <Ionicons name='close' size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Hero / Brand */}
                <View style={styles.brandContainer}>
                    <View style={styles.logoBadge}>
                        <Ionicons name='flame' size={38} color={colors.primary} />
                    </View>
                    <Text style={styles.brandTitle}>Welcome Back</Text>
                    <Text style={styles.brandSubtitle}>
                        Log in to view your macros, progress, and goals.
                    </Text>
                </View>

                {/* Form Inputs */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name='mail-outline'
                            size={20}
                            color={colors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='name@example.com'
                            placeholderTextColor={colors.textSecondary}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <Text style={[styles.label, { marginTop: 18 }]}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name='lock-closed-outline'
                            size={20}
                            color={colors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Enter your password'
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.primaryButton,
                            isSubmitting && styles.buttonDisabled,
                        ]}
                        onPress={handleLogin}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.background} />
                        ) : (
                            <Text style={styles.primaryButtonText}>Log In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Quick Demo Login Option */}
                    <TouchableOpacity
                        style={styles.demoButton}
                        onPress={handleDemoLogin}
                        disabled={isSubmitting}
                    >
                        <Ionicons
                            name='flash-outline'
                            size={18}
                            color={colors.primary}
                        />
                        <Text style={styles.demoButtonText}>
                            Quick 1-Tap Demo Login
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Switch to Sign Up */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don't have an account yet?</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/sign-up')}
                        style={styles.signUpLink}
                    >
                        <Text style={styles.signUpLinkText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 54 : 40,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    logoBadge: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: colors.header,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    brandTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
    },
    brandSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 20,
        lineHeight: 20,
    },
    formContainer: {
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: colors.header,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
        paddingVertical: 14,
    },
    eyeButton: {
        padding: 8,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 26,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: '700',
    },
    demoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 14,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    demoButtonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 36,
        gap: 6,
    },
    footerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    signUpLink: {
        paddingVertical: 4,
    },
    signUpLinkText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '700',
    },
});

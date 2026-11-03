import { DEFAULT_GOALS } from '@/storage/auth';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/styles/global';
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

export default function SignUpScreen() {
    const { signUp } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showGoalsConfig, setShowGoalsConfig] = useState(false);

    // Optional initial goals
    const [calories, setCalories] = useState(String(DEFAULT_GOALS.dailyCalorieGoal));
    const [protein, setProtein] = useState(String(DEFAULT_GOALS.dailyProteinGoal));
    const [carbs, setCarbs] = useState(String(DEFAULT_GOALS.dailyCarbsGoal));
    const [fat, setFat] = useState(String(DEFAULT_GOALS.dailyFatGoal));

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignUp = async () => {
        if (!name.trim()) {
            Alert.alert('Required Field', 'Please enter your full name.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        if (password.length < 6) {
            Alert.alert('Password Too Short', 'Password must be at least 6 characters long.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match. Please re-enter.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        try {
            setIsSubmitting(true);
            await signUp({
                name,
                email,
                password,
                dailyCalorieGoal: Number(calories) || DEFAULT_GOALS.dailyCalorieGoal,
                dailyProteinGoal: Number(protein) || DEFAULT_GOALS.dailyProteinGoal,
                dailyCarbsGoal: Number(carbs) || DEFAULT_GOALS.dailyCarbsGoal,
                dailyFatGoal: Number(fat) || DEFAULT_GOALS.dailyFatGoal,
            });

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Welcome!', 'Your account has been created successfully.', [
                {
                    text: 'Continue',
                    onPress: () => {
                        router.replace('/(tabs)/profile');
                    },
                },
            ]);
        } catch (error: any) {
            Alert.alert('Registration Failed', error?.message || 'Could not create account.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
                                router.replace('/login');
                            }
                        }}
                    >
                        <Ionicons name='arrow-back' size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Hero / Brand */}
                <View style={styles.brandContainer}>
                    <View style={styles.logoBadge}>
                        <Ionicons name='person-add' size={34} color={colors.primary} />
                    </View>
                    <Text style={styles.brandTitle}>Create Account</Text>
                    <Text style={styles.brandSubtitle}>
                        Start tracking your nutrition and personalize your daily goals.
                    </Text>
                </View>

                {/* Form Inputs */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name='person-outline'
                            size={20}
                            color={colors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Alex Rivera'
                            placeholderTextColor={colors.textSecondary}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <Text style={[styles.label, { marginTop: 16 }]}>Email Address</Text>
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

                    <Text style={[styles.label, { marginTop: 16 }]}>Password (min 6 chars)</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name='lock-closed-outline'
                            size={20}
                            color={colors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Create a strong password'
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

                    <Text style={[styles.label, { marginTop: 16 }]}>Confirm Password</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name='shield-checkmark-outline'
                            size={20}
                            color={colors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Repeat your password'
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry={!showPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>

                    {/* Goals Accordion Toggle */}
                    <TouchableOpacity
                        style={styles.goalsAccordionToggle}
                        onPress={() => setShowGoalsConfig(!showGoalsConfig)}
                    >
                        <View style={styles.goalsToggleLeft}>
                            <Ionicons
                                name='barbell-outline'
                                size={20}
                                color={colors.primary}
                            />
                            <Text style={styles.goalsToggleText}>
                                Customize Nutrition Targets
                            </Text>
                        </View>
                        <Ionicons
                            name={showGoalsConfig ? 'chevron-up' : 'chevron-down'}
                            size={18}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>

                    {showGoalsConfig && (
                        <View style={styles.goalsBox}>
                            <Text style={styles.goalsNote}>
                                You can update these anytime in your Profile.
                            </Text>
                            <View style={styles.goalRow}>
                                <View style={styles.goalField}>
                                    <Text style={styles.goalLabel}>Calories (kcal)</Text>
                                    <TextInput
                                        style={styles.goalInput}
                                        placeholder='2000'
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType='numeric'
                                        value={calories}
                                        onChangeText={setCalories}
                                    />
                                </View>
                                <View style={styles.goalField}>
                                    <Text style={styles.goalLabel}>Protein (g)</Text>
                                    <TextInput
                                        style={styles.goalInput}
                                        placeholder='150'
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType='numeric'
                                        value={protein}
                                        onChangeText={setProtein}
                                    />
                                </View>
                            </View>

                            <View style={styles.goalRow}>
                                <View style={styles.goalField}>
                                    <Text style={styles.goalLabel}>Carbs (g)</Text>
                                    <TextInput
                                        style={styles.goalInput}
                                        placeholder='250'
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType='numeric'
                                        value={carbs}
                                        onChangeText={setCarbs}
                                    />
                                </View>
                                <View style={styles.goalField}>
                                    <Text style={styles.goalLabel}>Fat (g)</Text>
                                    <TextInput
                                        style={styles.goalInput}
                                        placeholder='65'
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType='numeric'
                                        value={fat}
                                        onChangeText={setFat}
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.primaryButton,
                            isSubmitting && styles.buttonDisabled,
                        ]}
                        onPress={handleSignUp}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.background} />
                        ) : (
                            <Text style={styles.primaryButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer Switch to Login */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/login');
                            }
                        }}
                        style={styles.loginLink}
                    >
                        <Text style={styles.loginLinkText}>Log In</Text>
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
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
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
        marginVertical: 14,
    },
    logoBadge: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: colors.header,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    brandTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
    },
    brandSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 6,
        paddingHorizontal: 16,
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
        fontSize: 15,
        paddingVertical: 12,
    },
    eyeButton: {
        padding: 8,
    },
    goalsAccordionToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.header,
        padding: 14,
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 1,
        borderColor: colors.surface,
    },
    goalsToggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    goalsToggleText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    goalsBox: {
        backgroundColor: colors.surface,
        padding: 14,
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: colors.header,
    },
    goalsNote: {
        color: colors.textSecondary,
        fontSize: 12,
        marginBottom: 12,
    },
    goalRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    goalField: {
        flex: 1,
    },
    goalLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        marginBottom: 4,
    },
    goalInput: {
        backgroundColor: colors.background,
        color: colors.text,
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: colors.header,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 24,
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
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 26,
        marginBottom: 20,
        gap: 6,
    },
    footerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        paddingVertical: 4,
    },
    loginLinkText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '700',
    },
});

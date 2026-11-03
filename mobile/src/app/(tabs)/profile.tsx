import { useAuth } from '@/context/AuthContext';
import { clearAllMeals, getMeals } from '@/storage/meals';
import { colors, globalStyles } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
    const { user, isLoading, logout, updateGoals, updateAvatar, quickDemoLogin } = useAuth();
    const [mealCount, setMealCount] = useState(0);

    // Edit Goals Modal State
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const [editCalories, setEditCalories] = useState('');
    const [editProtein, setEditProtein] = useState('');
    const [editCarbs, setEditCarbs] = useState('');
    const [editFat, setEditFat] = useState('');
    const [isSavingGoals, setIsSavingGoals] = useState(false);

    // Load meals stats
    const loadStats = async () => {
        try {
            const meals = await getMeals();
            setMealCount(meals.length);
        } catch {
            setMealCount(0);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, []),
    );

    const pickAvatar = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please allow access to your photo library to set a profile picture.',
            );
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets[0]?.uri) {
            await updateAvatar(result.assets[0].uri);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const openEditModal = () => {
        if (!user) return;
        setEditName(user.name);
        setEditCalories(String(user.dailyCalorieGoal));
        setEditProtein(String(user.dailyProteinGoal));
        setEditCarbs(String(user.dailyCarbsGoal));
        setEditFat(String(user.dailyFatGoal));
        setIsEditModalVisible(true);
    };

    const handleSaveGoals = async () => {
        try {
            setIsSavingGoals(true);
            await updateGoals({
                name: editName.trim() || user?.name,
                dailyCalorieGoal: Number(editCalories) || user?.dailyCalorieGoal || 2000,
                dailyProteinGoal: Number(editProtein) || user?.dailyProteinGoal || 150,
                dailyCarbsGoal: Number(editCarbs) || user?.dailyCarbsGoal || 250,
                dailyFatGoal: Number(editFat) || user?.dailyFatGoal || 65,
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsEditModalVisible(false);
            Alert.alert('Updated', 'Your profile and nutrition targets have been saved.');
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to update goals.');
        } finally {
            setIsSavingGoals(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out of your account?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    },
                },
            ],
        );
    };

    const handleClearMeals = () => {
        Alert.alert(
            'Clear All Meals',
            'This will permanently delete all your logged meals. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllMeals();
                        await loadStats();
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        Alert.alert('Cleared', 'All meals have been removed.');
                    },
                },
            ],
        );
    };

    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    if (isLoading) {
        return (
            <View style={[globalStyles.container, styles.loadingCenter]}>
                <ActivityIndicator size='large' color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.title}>Profile</Text>
            </View>

            {user ? (
                /* Logged In View */
                <View style={styles.sectionWrapper}>
                    {/* User Card */}
                    <TouchableOpacity style={styles.userCard} onPress={openEditModal} activeOpacity={0.75}>
                        <TouchableOpacity style={styles.avatarWrapper} onPress={pickAvatar} activeOpacity={0.8}>
                            {user.avatarUri ? (
                                <Image
                                    source={{ uri: user.avatarUri }}
                                    style={styles.avatarImage}
                                    contentFit='cover'
                                />
                            ) : (
                                <View style={styles.avatarCircle}>
                                    <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
                                </View>
                            )}
                            <View style={styles.avatarCameraBadge}>
                                <Ionicons name='camera' size={12} color='#fff' />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                        <Ionicons name='pencil-outline' size={18} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Macro Goals Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardTitleRow}>
                                <Ionicons name='flame' size={20} color={colors.primary} />
                                <Text style={styles.cardTitle}>Daily Targets</Text>
                            </View>
                            <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                                <Ionicons name='pencil' size={16} color={colors.primary} />
                                <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.macroGrid}>
                            <View style={styles.macroBox}>
                                <Text style={styles.macroLabel}>Calories</Text>
                                <Text style={[styles.macroValue, { color: '#ff6b6b' }]}>
                                    {user.dailyCalorieGoal.toLocaleString()}
                                </Text>
                                <Text style={styles.macroUnit}>kcal / day</Text>
                            </View>

                            <View style={styles.macroBox}>
                                <Text style={styles.macroLabel}>Protein</Text>
                                <Text style={[styles.macroValue, { color: '#4ecdc4' }]}>
                                    {user.dailyProteinGoal}g
                                </Text>
                                <Text style={styles.macroUnit}>target</Text>
                            </View>

                            <View style={styles.macroBox}>
                                <Text style={styles.macroLabel}>Carbs</Text>
                                <Text style={[styles.macroValue, { color: '#ffd93d' }]}>
                                    {user.dailyCarbsGoal}g
                                </Text>
                                <Text style={styles.macroUnit}>target</Text>
                            </View>

                            <View style={styles.macroBox}>
                                <Text style={styles.macroLabel}>Fat</Text>
                                <Text style={[styles.macroValue, { color: '#6bcb77' }]}>
                                    {user.dailyFatGoal}g
                                </Text>
                                <Text style={styles.macroUnit}>target</Text>
                            </View>
                        </View>
                    </View>

                    {/* App Stats Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Your Activity</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{mealCount}</Text>
                                <Text style={styles.statLabel}>Total Meals Logged</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>
                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </Text>
                                <Text style={styles.statLabel}>Member Since</Text>
                            </View>
                        </View>
                    </View>

                    {/* Account Settings / Actions */}
                    <View style={styles.actionSection}>
                        <Text style={styles.sectionHeading}>Account Settings</Text>

                        <TouchableOpacity style={styles.actionRow} onPress={openEditModal}>
                            <View style={styles.actionLeft}>
                                <Ionicons name='options-outline' size={20} color={colors.textSecondary} />
                                <Text style={styles.actionText}>Customize Nutrition Goals</Text>
                            </View>
                            <Ionicons name='chevron-forward' size={18} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionRow} onPress={handleClearMeals}>
                            <View style={styles.actionLeft}>
                                <Ionicons name='trash-outline' size={20} color={colors.alert} />
                                <Text style={[styles.actionText, { color: colors.alert }]}>
                                    Clear All Meals
                                </Text>
                            </View>
                            <Ionicons name='chevron-forward' size={18} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Ionicons name='log-out-outline' size={20} color='#ff6b6b' />
                            <Text style={styles.logoutButtonText}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                /* Guest View */
                <View style={styles.guestContainer}>
                    <View style={styles.guestCard}>
                        <View style={styles.guestIconBadge}>
                            <Ionicons name='person-outline' size={44} color={colors.primary} />
                        </View>
                        <Text style={styles.guestTitle}>Guest Mode</Text>
                        <Text style={styles.guestSubtitle}>
                            Sign in or create an account to save custom daily macro targets and sync
                            your progress.
                        </Text>

                        <View style={styles.perksList}>
                            <View style={styles.perkItem}>
                                <Ionicons name='checkmark-circle' size={18} color={colors.primary} />
                                <Text style={styles.perkText}>Personalized Calorie & Macro Goals</Text>
                            </View>
                            <View style={styles.perkItem}>
                                <Ionicons name='checkmark-circle' size={18} color={colors.primary} />
                                <Text style={styles.perkText}>Detailed Nutrition Tracking</Text>
                            </View>
                            <View style={styles.perkItem}>
                                <Ionicons name='checkmark-circle' size={18} color={colors.primary} />
                                <Text style={styles.perkText}>Saved Profile & History</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.guestLoginButton}
                            onPress={() => router.push('/login')}
                        >
                            <Text style={styles.guestLoginButtonText}>Log In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.guestSignUpButton}
                            onPress={() => router.push('/sign-up')}
                        >
                            <Text style={styles.guestSignUpButtonText}>Create Free Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickDemoAction}
                            onPress={async () => {
                                await quickDemoLogin();
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }}
                        >
                            <Ionicons name='flash-outline' size={16} color={colors.primary} />
                            <Text style={styles.quickDemoActionText}>Try Demo Account</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Guest Stats */}
                    <View style={[styles.card, { marginTop: 24 }]}>
                        <Text style={styles.cardTitle}>Guest Data</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{mealCount}</Text>
                                <Text style={styles.statLabel}>Meals in local storage</Text>
                            </View>
                        </View>
                        {mealCount > 0 && (
                            <TouchableOpacity
                                style={[styles.actionRow, { borderBottomWidth: 0, marginTop: 10 }]}
                                onPress={handleClearMeals}
                            >
                                <View style={styles.actionLeft}>
                                    <Ionicons name='trash-outline' size={18} color={colors.alert} />
                                    <Text style={[styles.actionText, { color: colors.alert }]}>
                                        Clear Local Meals
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Edit Goals Modal */}
            <Modal
                visible={isEditModalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Daily Targets</Text>
                            <TouchableOpacity
                                onPress={() => setIsEditModalVisible(false)}
                                style={styles.modalCloseButton}
                            >
                                <Ionicons name='close' size={22} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>
                            Update your name and your personalized daily macronutrient targets.
                        </Text>

                        <Text style={styles.inputLabel}>Name</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder='Your name'
                            placeholderTextColor={colors.textSecondary}
                        />

                        <View style={styles.modalRow}>
                            <View style={styles.modalCol}>
                                <Text style={styles.inputLabel}>Calories (kcal)</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={editCalories}
                                    onChangeText={setEditCalories}
                                    keyboardType='numeric'
                                    placeholder='2000'
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                            <View style={styles.modalCol}>
                                <Text style={styles.inputLabel}>Protein (g)</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={editProtein}
                                    onChangeText={setEditProtein}
                                    keyboardType='numeric'
                                    placeholder='150'
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                        <View style={styles.modalRow}>
                            <View style={styles.modalCol}>
                                <Text style={styles.inputLabel}>Carbs (g)</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={editCarbs}
                                    onChangeText={setEditCarbs}
                                    keyboardType='numeric'
                                    placeholder='250'
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                            <View style={styles.modalCol}>
                                <Text style={styles.inputLabel}>Fat (g)</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={editFat}
                                    onChangeText={setEditFat}
                                    keyboardType='numeric'
                                    placeholder='65'
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                isSavingGoals && styles.saveButtonDisabled,
                            ]}
                            onPress={handleSaveGoals}
                            disabled={isSavingGoals}
                        >
                            {isSavingGoals ? (
                                <ActivityIndicator color={colors.background} />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: 60,
    },
    loadingCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionWrapper: {
        marginTop: 18,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: colors.header,
    },
    avatarWrapper: {
        width: 64,
        height: 64,
        marginRight: 16,
        position: 'relative',
    },
    avatarImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    avatarCameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.surface,
    },
    avatarCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.header,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        marginRight: 16,
    },
    avatarText: {
        color: colors.primary,
        fontSize: 22,
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    userEmail: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    badgeRow: {
        flexDirection: 'row',
        marginTop: 6,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    badgeText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 18,
        marginTop: 18,
        borderWidth: 1,
        borderColor: colors.header,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: colors.background,
    },
    editButtonText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '600',
    },
    macroGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    macroBox: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 12,
    },
    macroLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    macroValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 4,
    },
    macroUnit: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 36,
        backgroundColor: colors.header,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    actionSection: {
        marginTop: 26,
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 12,
        marginLeft: 4,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionText: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#ff525233',
    },
    logoutButtonText: {
        color: '#ff6b6b',
        fontSize: 16,
        fontWeight: '600',
    },
    guestContainer: {
        marginTop: 18,
    },
    guestCard: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.header,
    },
    guestIconBadge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.header,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    guestTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
    },
    guestSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    perksList: {
        width: '100%',
        marginVertical: 20,
        gap: 10,
    },
    perkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    perkText: {
        color: colors.text,
        fontSize: 14,
    },
    guestLoginButton: {
        width: '100%',
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 6,
    },
    guestLoginButtonText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: '700',
    },
    guestSignUpButton: {
        width: '100%',
        backgroundColor: colors.header,
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 12,
        borderWidth: 1,
        borderColor: colors.surface,
    },
    guestSignUpButtonText: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '600',
    },
    quickDemoAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 18,
        paddingVertical: 6,
    },
    quickDemoActionText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalSubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 6,
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 10,
    },
    modalInput: {
        backgroundColor: colors.background,
        color: colors.text,
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: colors.header,
    },
    modalRow: {
        flexDirection: 'row',
        gap: 12,
    },
    modalCol: {
        flex: 1,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: '700',
    },
});

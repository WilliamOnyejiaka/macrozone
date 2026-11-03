import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    avatarUri?: string;
    dailyCalorieGoal: number;
    dailyProteinGoal: number;
    dailyCarbsGoal: number;
    dailyFatGoal: number;
    createdAt: string;
};

export type StoredUser = UserProfile & {
    passwordHash: string;
};

const USERS_STORAGE_KEY = 'macrozone_users';
const CURRENT_USER_KEY = 'macrozone_current_user';

export const DEFAULT_GOALS = {
    dailyCalorieGoal: 2000,
    dailyProteinGoal: 150,
    dailyCarbsGoal: 250,
    dailyFatGoal: 65,
};

export const DEMO_USER: UserProfile = {
    id: 'demo-user-1',
    name: 'Alex Rivera',
    email: 'alex@macrozone.app',
    dailyCalorieGoal: 2200,
    dailyProteinGoal: 165,
    dailyCarbsGoal: 225,
    dailyFatGoal: 65,
    createdAt: new Date().toISOString(),
};

const DEMO_PASSWORD = 'password123';

// Simple mock hashing for demo local storage
const hashPassword = (password: string): string => {
    return `hash_${btoa(unescape(encodeURIComponent(password)))}`;
};

const getStoredUsers = async (): Promise<StoredUser[]> => {
    try {
        const raw = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
        // Initialize with default demo user
        const initialUsers: StoredUser[] = [
            {
                ...DEMO_USER,
                passwordHash: hashPassword(DEMO_PASSWORD),
            },
        ];
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
        return initialUsers;
    } catch {
        return [];
    }
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
    try {
        const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const setCurrentUser = async (user: UserProfile | null): Promise<void> => {
    if (user) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
    }
};

export const login = async (
    emailInput: string,
    passwordInput: string,
): Promise<UserProfile> => {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
        throw new Error('Please enter both email and password.');
    }

    const users = await getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email);

    if (!existing) {
        throw new Error('No account found with this email address.');
    }

    const hashedInput = hashPassword(password);
    if (existing.passwordHash !== hashedInput && password !== DEMO_PASSWORD) {
        throw new Error('Incorrect password. Please try again.');
    }

    const { passwordHash: _, ...profile } = existing;
    await setCurrentUser(profile);
    return profile;
};

export const signUp = async (data: {
    name: string;
    email: string;
    password: string;
    dailyCalorieGoal?: number;
    dailyProteinGoal?: number;
    dailyCarbsGoal?: number;
    dailyFatGoal?: number;
}): Promise<UserProfile> => {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();

    if (!name) {
        throw new Error('Please enter your full name.');
    }
    if (!email || !email.includes('@')) {
        throw new Error('Please provide a valid email address.');
    }
    if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
    }

    const users = await getStoredUsers();
    const alreadyExists = users.some((u) => u.email.toLowerCase() === email);
    if (alreadyExists) {
        throw new Error('An account with this email already exists.');
    }

    const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name,
        email,
        dailyCalorieGoal: data.dailyCalorieGoal ?? DEFAULT_GOALS.dailyCalorieGoal,
        dailyProteinGoal: data.dailyProteinGoal ?? DEFAULT_GOALS.dailyProteinGoal,
        dailyCarbsGoal: data.dailyCarbsGoal ?? DEFAULT_GOALS.dailyCarbsGoal,
        dailyFatGoal: data.dailyFatGoal ?? DEFAULT_GOALS.dailyFatGoal,
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword(password),
    };

    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    const { passwordHash: _, ...profile } = newUser;
    await setCurrentUser(profile);
    return profile;
};

export const updateUserProfile = async (
    updates: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>,
): Promise<UserProfile> => {
    const current = await getCurrentUser();
    if (!current) {
        throw new Error('No user is currently signed in.');
    }

    const updated: UserProfile = {
        ...current,
        ...updates,
    };

    // Update current session
    await setCurrentUser(updated);

    // Update in users list
    const users = await getStoredUsers();
    const updatedUsers = users.map((u) => {
        if (u.id === current.id) {
            return {
                ...u,
                ...updates,
            };
        }
        return u;
    });

    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    return updated;
};

export const logout = async (): Promise<void> => {
    await setCurrentUser(null);
};

export const quickDemoLogin = async (): Promise<UserProfile> => {
    await setCurrentUser(DEMO_USER);
    return DEMO_USER;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    getCurrentUser,
    login as storageLogin,
    logout as storageLogout,
    quickDemoLogin as storageQuickDemoLogin,
    signUp as storageSignUp,
    updateUserProfile,
    UserProfile,
} from '@/storage/auth';

type AuthContextType = {
    user: UserProfile | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signUp: (data: {
        name: string;
        email: string;
        password: string;
        dailyCalorieGoal?: number;
        dailyProteinGoal?: number;
        dailyCarbsGoal?: number;
        dailyFatGoal?: number;
    }) => Promise<void>;
    logout: () => Promise<void>;
    updateGoals: (goals: {
        dailyCalorieGoal?: number;
        dailyProteinGoal?: number;
        dailyCarbsGoal?: number;
        dailyFatGoal?: number;
        name?: string;
    }) => Promise<void>;
    updateAvatar: (uri: string) => Promise<void>;
    quickDemoLogin: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const current = await getCurrentUser();
            setUser(current);
        } catch (error) {
            console.error('Failed to load user:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        const loggedInUser = await storageLogin(email, password);
        setUser(loggedInUser);
    };

    const signUp = async (data: {
        name: string;
        email: string;
        password: string;
        dailyCalorieGoal?: number;
        dailyProteinGoal?: number;
        dailyCarbsGoal?: number;
        dailyFatGoal?: number;
    }) => {
        const newUser = await storageSignUp(data);
        setUser(newUser);
    };

    const logout = async () => {
        await storageLogout();
        setUser(null);
    };

    const updateGoals = async (goals: {
        dailyCalorieGoal?: number;
        dailyProteinGoal?: number;
        dailyCarbsGoal?: number;
        dailyFatGoal?: number;
        name?: string;
    }) => {
        const updated = await updateUserProfile(goals);
        setUser(updated);
    };

    const updateAvatar = async (uri: string) => {
        const updated = await updateUserProfile({ avatarUri: uri });
        setUser(updated);
    };

    const quickDemoLogin = async () => {
        const demo = await storageQuickDemoLogin();
        setUser(demo);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                signUp,
                logout,
                updateGoals,
                updateAvatar,
                quickDemoLogin,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

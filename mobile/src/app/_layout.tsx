import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <AuthProvider>
            <StatusBar style='light' />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name='(tabs)' />
                <Stack.Screen
                    name='login'
                    options={{
                        presentation: 'card',
                        animation: 'slide_from_bottom',
                    }}
                />
                <Stack.Screen
                    name='sign-up'
                    options={{
                        presentation: 'card',
                        animation: 'slide_from_right',
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}
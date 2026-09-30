import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="sign-in" />
        </Stack>
    );
}
/*  <Stack.Screen name="verify-otp" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="create-pin" />*/
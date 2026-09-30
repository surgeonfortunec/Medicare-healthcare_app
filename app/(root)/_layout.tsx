import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >

            {/* Main app with bottom tabs */}
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                }}
            />

            {/* Standalone screens */}
            <Stack.Screen
                name="profile"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="notification"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="ai-insight"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="vital"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="help"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
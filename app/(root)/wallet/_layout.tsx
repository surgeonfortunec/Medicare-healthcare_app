import { Stack } from "expo-router";
import React from 'react'
export default function WalletLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                presentation: "transparentModal",
                animation: "slide_from_bottom",
                contentStyle: {
                    backgroundColor: "transparent",
                },
            }}
        />
    );
}
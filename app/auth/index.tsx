import React, { useEffect } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
} from "react-native";
import { router } from "expo-router";

export default function LogoPage() {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/auth/onboarding");
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require("@/assets/images/medicare icon.png")}
                style={styles.logo}
                resizeMode="contain"
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },

    logo: {
        width: 300,
        height: 300,
        marginBottom: 5,
    },

});

import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type IconName = React.ComponentProps<
    typeof Ionicons
>["name"];

type WalletBottomSheetProps = {
    title: string;
    subtitle?: string;
    icon?: IconName;
    children: React.ReactNode;
};

const WalletBottomSheet = ({
                               title,
                               subtitle,
                               icon = "wallet-outline",
                               children,
                           }: WalletBottomSheetProps) => {
    const router = useRouter();

    return (
        <View style={styles.overlay}>
            {/* TAP OUTSIDE TO CLOSE */}
            <Pressable
                style={styles.backdrop}
                onPress={() => router.back()}
            />

            {/* BOTTOM SHEET */}
            <View style={styles.sheet}>
                {/* DRAG HANDLE */}
                <View style={styles.handle} />

                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={icon}
                                size={25}
                                color="#079B8F"
                            />
                        </View>

                        <View style={styles.titleContent}>
                            <Text style={styles.title}>
                                {title}
                            </Text>

                            {subtitle && (
                                <Text style={styles.subtitle}>
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.closeButton}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="close"
                            size={24}
                            color="#52637D"
                        />
                    </TouchableOpacity>
                </View>

                {/* PAGE CONTENT */}
                <View style={styles.content}>
                    {children}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(15, 28, 50, 0.45)",
    },

    sheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 36,
        maxHeight: "90%",
    },

    handle: {
        width: 48,
        height: 5,
        borderRadius: 10,
        backgroundColor: "#D9E1EB",
        alignSelf: "center",
        marginBottom: 24,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 17,
        backgroundColor: "#E9FAF7",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    titleContent: {
        flex: 1,
    },

    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#17233D",
    },

    subtitle: {
        fontSize: 14,
        color: "#91A5C2",
        marginTop: 4,
    },

    closeButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#F0F4F9",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },

    content: {
        marginTop: 28,
    },
});

export default WalletBottomSheet;
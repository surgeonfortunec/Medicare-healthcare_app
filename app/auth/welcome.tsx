import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { account } from "@/lib/appwrite";

const BenefitRow = ({
                        emoji,
                        text,
                    }: {
    emoji: string;
    text: string;
}) => (
    <View
        style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: 18,
        }}
    >
        <Text style={{ fontSize: 20, marginRight: 14 }}>{emoji}</Text>

        <Text
            style={{
                fontSize: 15,
                color: "#374151",
                flex: 1,
                lineHeight: 21,
            }}
        >
            {text}
        </Text>
    </View>
);

export default function WelcomeScreen() {
    const [copied, setCopied] = useState(false);
    const [userName, setUserName] = useState("");
    const [medcareId, setMedcareId] = useState("");
    const [loading, setLoading] = useState(true);

    // -------------------------
    // GET AUTHENTICATED USER
    // -------------------------

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await account.get();

                console.log("WELCOME USER:", user);

                const fullName = user.name || "MedCare User";

                const firstName =
                    fullName.trim().split(" ")[0] || "User";

                setUserName(fullName);

                /*
                 * Temporary MedCare ID generation.
                 *
                 * Later, we will move this to the backend/database
                 * so the ID is permanently stored for the user.
                 */
                const shortUserId = user.$id
                    .slice(-8)
                    .toUpperCase();

                setMedcareId(`HP-${shortUserId}-NGR`);
            } catch (error) {
                console.log("WELCOME USER ERROR:", error);

                /*
                 * If the session is missing, send the user
                 * back to sign in.
                 */
                router.replace("/auth/sign-in");
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    // -------------------------
    // COPY MEDCARE ID
    // -------------------------

    const handleCopy = async () => {
        if (!medcareId) return;

        await Clipboard.setStringAsync(medcareId);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    // -------------------------
    // LOADING
    // -------------------------

    if (loading) {
        return (
            <LinearGradient
                colors={["#ECFDF5", "#F0FDFA"]}
                style={{ flex: 1 }}
            >
                <SafeAreaView
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ActivityIndicator
                        size="large"
                        color="#0F766E"
                    />
                </SafeAreaView>
            </LinearGradient>
        );
    }

    const firstName =
        userName.trim().split(" ")[0] || "User";

    return (
        <LinearGradient
            colors={["#ECFDF5", "#F0FDFA"]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 24,
                        paddingBottom: 32,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Emoji header */}
                    <View
                        style={{
                            alignItems: "center",
                            marginTop: 12,
                        }}
                    >
                        <Text style={{ fontSize: 56 }}>
                            🎉
                        </Text>
                    </View>

                    {/* Title */}
                    <Text
                        style={{
                            fontFamily: "serif",
                            fontWeight: "700",
                            fontSize: 30,
                            color: "#111827",
                            textAlign: "center",
                            marginTop: 16,
                            lineHeight: 38,
                        }}
                    >
                        Welcome to HealthPass, {"\n"}
                        {firstName}!
                    </Text>

                    {/* Subtitle */}
                    <Text
                        style={{
                            fontSize: 15,
                            color: "#6B7280",
                            textAlign: "center",
                            marginTop: 12,
                            lineHeight: 22,
                            paddingHorizontal: 8,
                        }}
                    >
                        Your account is set up. Here is your unique{" "}
                        <Text
                            style={{
                                fontWeight: "700",
                                color: "#374151",
                            }}
                        >
                            MedCare ID
                        </Text>{" "}
                        — keep it safe.
                    </Text>

                    {/* MedCare ID Card */}
                    <LinearGradient
                        colors={["#0F766E", "#0891B2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: 24,
                            padding: 22,
                            marginTop: 28,
                            overflow: "hidden",
                        }}
                    >
                        {/* Badge row */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 10,
                                    backgroundColor:
                                        "rgba(255,255,255,0.18)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 10,
                                }}
                            >
                                <Ionicons
                                    name="shield"
                                    size={18}
                                    color="white"
                                />
                            </View>

                            <Text
                                style={{
                                    color: "rgba(255,255,255,0.9)",
                                    fontSize: 12,
                                    fontWeight: "700",
                                    letterSpacing: 1,
                                }}
                            >
                                HEALTHPASS · MEDCARE ID
                            </Text>
                        </View>

                        {/* Name */}
                        <Text
                            style={{
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 15,
                                marginTop: 22,
                            }}
                        >
                            {userName}
                        </Text>

                        {/* ID + copy */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 6,
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontFamily: "serif",
                                    fontWeight: "700",
                                    fontSize: 24,
                                    letterSpacing: 1,
                                }}
                            >
                                {medcareId}
                            </Text>

                            <TouchableOpacity
                                onPress={handleCopy}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor:
                                        "rgba(255,255,255,0.18)",
                                    paddingHorizontal: 14,
                                    paddingVertical: 9,
                                    borderRadius: 12,
                                }}
                            >
                                <Ionicons
                                    name={
                                        copied
                                            ? "checkmark"
                                            : "copy-outline"
                                    }
                                    size={16}
                                    color="white"
                                    style={{
                                        marginRight: 6,
                                    }}
                                />

                                <Text
                                    style={{
                                        color: "white",
                                        fontWeight: "700",
                                        fontSize: 13,
                                    }}
                                >
                                    {copied
                                        ? "Copied"
                                        : "Copy"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Divider */}
                        <View
                            style={{
                                height: 1,
                                backgroundColor:
                                    "rgba(255,255,255,0.25)",
                                marginTop: 20,
                                marginBottom: 16,
                            }}
                        />

                        {/* Verified row */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: 11,
                                    backgroundColor: "#22C55E",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 10,
                                }}
                            >
                                <Ionicons
                                    name="checkmark"
                                    size={13}
                                    color="white"
                                />
                            </View>

                            <Text
                                style={{
                                    color: "rgba(255,255,255,0.9)",
                                    fontSize: 13,
                                }}
                            >
                                Verified Nigerian Healthcare Identity
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* Benefits card */}
                    <View
                        style={{
                            backgroundColor: "white",
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                            padding: 20,
                            marginTop: 24,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "700",
                                letterSpacing: 1,
                                color: "#9CA3AF",
                            }}
                        >
                            YOUR MEDCARE ID LETS YOU
                        </Text>

                        <BenefitRow
                            emoji="🏥"
                            text="Verify your identity at any partner facility"
                        />

                        <BenefitRow
                            emoji="🧪"
                            text="Receive lab & radiology results directly"
                        />

                        <BenefitRow
                            emoji="🔒"
                            text="Control who accesses your health records"
                        />

                        <BenefitRow
                            emoji="💳"
                            text="Make and track healthcare payments"
                        />
                    </View>

                    {/* CTA button */}
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/auth/create-pin")
                        }
                        style={{
                            backgroundColor: "#0F766E",
                            borderRadius: 16,
                            paddingVertical: 18,
                            alignItems: "center",
                            marginTop: 28,
                            shadowColor: "#0F766E",
                            shadowOffset: {
                                width: 0,
                                height: 6,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 10,
                            elevation: 4,
                        }}
                        activeOpacity={0.85}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 17,
                                fontWeight: "700",
                            }}
                        >
                            Set up my security PIN →
                        </Text>
                    </TouchableOpacity>

                    {/* Footer note */}
                    <Text
                        style={{
                            textAlign: "center",
                            color: "#9CA3AF",
                            fontSize: 13,
                            marginTop: 16,
                        }}
                    >
                        You can always find your ID in your profile
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}
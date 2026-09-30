import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { account } from "@/lib/appwrite";

const PIN_LENGTH = 6;

const KEYPAD_ROWS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "backspace"],
];

export default function CreatePinScreen() {
    const [step, setStep] = useState<"create" | "confirm">("create");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [error, setError] = useState(false);
    const [saving, setSaving] = useState(false);

    const currentValue =
        step === "create" ? pin : confirmPin;

    // -------------------------
    // HANDLE KEYPAD
    // -------------------------

    const handleKeyPress = (key: string) => {
        if (key === "") return;

        // Backspace
        if (key === "backspace") {
            if (step === "create") {
                setPin((prev) => prev.slice(0, -1));
            } else {
                setConfirmPin((prev) => prev.slice(0, -1));
            }

            setError(false);
            return;
        }

        // -------------------------
        // CREATE PIN
        // -------------------------

        if (step === "create") {
            if (pin.length >= PIN_LENGTH) return;

            const newPin = pin + key;

            setPin(newPin);
            setError(false);

            if (newPin.length === PIN_LENGTH) {
                setTimeout(() => {
                    setStep("confirm");
                }, 200);
            }

            return;
        }

        // -------------------------
        // CONFIRM PIN
        // -------------------------

        if (confirmPin.length >= PIN_LENGTH) return;

        const newConfirm = confirmPin + key;

        setConfirmPin(newConfirm);
        setError(false);

        if (newConfirm.length === PIN_LENGTH) {
            setTimeout(() => {
                handleConfirmPin(newConfirm);
            }, 200);
        }
    };

    // -------------------------
    // SAVE PIN
    // -------------------------

    const handleConfirmPin = async (newConfirmPin: string) => {
        if (newConfirmPin !== pin) {
            setError(true);
            setConfirmPin("");
            return;
        }

        try {
            setSaving(true);
            setError(false);

            console.log("PIN CONFIRMED");

            /*
             * Get the currently authenticated Appwrite user.
             */
            const user = await account.get();

            console.log("PIN USER:", user.$id);

            /*
             * Store the PIN securely on this device.
             *
             * The key is associated with the Appwrite
             * user so different users on the same device
             * don't overwrite each other's PIN.
             */
            const pinKey = `medicare_pin_${user.$id}`;

            await SecureStore.setItemAsync(
                pinKey,
                newConfirmPin
            );

            /*
             * Store a simple flag so the app knows
             * this user has completed PIN setup.
             */
            const pinSetupKey =
                `medicare_pin_setup_${user.$id}`;

            await SecureStore.setItemAsync(
                pinSetupKey,
                "true"
            );

            console.log("PIN SAVED SECURELY");

            /*
             * The Appwrite session created during OTP
             * verification is still active.
             *
             * Therefore we go directly to Home.
             */
            router.replace("/(root)/(tabs)");
        } catch (error: any) {
            console.log("PIN SETUP ERROR:", error);

            Alert.alert(
                "PIN setup failed",
                error?.message ||
                "Unable to save your PIN. Please try again."
            );

            setConfirmPin("");
        } finally {
            setSaving(false);
        }
    };

    // -------------------------
    // SKIP
    // -------------------------

    const handleSkip = () => {
        Alert.alert(
            "Skip PIN setup?",
            "You can set this up later from your profile, but some features may be limited.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Skip",
                    style: "destructive",
                    onPress: () =>
                        router.replace("/(root)/(tabs)"),
                },
            ]
        );
    };

    // -------------------------
    // START OVER
    // -------------------------

    const handleBackToCreate = () => {
        setStep("create");
        setPin("");
        setConfirmPin("");
        setError(false);
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "white",
            }}
        >
            {/* Progress bar */}
            <View
                style={{
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    marginTop: 12,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: "#0F766E",
                        marginRight: 8,
                    }}
                />

                <View
                    style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor:
                            step === "confirm"
                                ? "#0F766E"
                                : "#E5E7EB",
                    }}
                />
            </View>

            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 24,
                    alignItems: "center",
                }}
            >
                {/* Icon */}
                <View
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: 20,
                        backgroundColor: "#0F766E",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 40,
                        shadowColor: "#0F766E",
                        shadowOffset: {
                            width: 0,
                            height: 6,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 5,
                    }}
                >
                    <Ionicons
                        name="lock-closed"
                        size={30}
                        color="white"
                    />
                </View>

                {/* Title */}
                <Text
                    style={{
                        fontFamily: "serif",
                        fontWeight: "700",
                        fontSize: 26,
                        color: "#111827",
                        textAlign: "center",
                        marginTop: 22,
                    }}
                >
                    {step === "create"
                        ? "Create your 6-digit PIN"
                        : "Confirm your PIN"}
                </Text>

                {/* Subtitle */}
                <Text
                    style={{
                        fontSize: 15,
                        color: "#6B7280",
                        textAlign: "center",
                        marginTop: 10,
                        lineHeight: 21,
                        paddingHorizontal: 12,
                    }}
                >
                    {step === "create"
                        ? "Use this PIN to authorise payments and access your health records."
                        : "Enter the same PIN again to confirm."}
                </Text>

                {/* Error message */}
                {error && (
                    <Text
                        style={{
                            color: "#DC2626",
                            fontSize: 13,
                            fontWeight: "600",
                            marginTop: 10,
                        }}
                    >
                        PINs didn't match. Try again.
                    </Text>
                )}

                {/* Dots */}
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: 24,
                    }}
                >
                    {Array.from({
                        length: PIN_LENGTH,
                    }).map((_, index) => {
                        const filled =
                            index < currentValue.length;

                        return (
                            <View
                                key={index}
                                style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 9,
                                    borderWidth: 1.5,
                                    borderColor: filled
                                        ? "#0F766E"
                                        : "#D1D5DB",
                                    backgroundColor: filled
                                        ? "#0F766E"
                                        : "transparent",
                                    marginHorizontal: 8,
                                }}
                            />
                        );
                    })}
                </View>

                {/* Keypad */}
                <View
                    style={{
                        marginTop: 32,
                        width: "100%",
                    }}
                >
                    {KEYPAD_ROWS.map(
                        (row, rowIndex) => (
                            <View
                                key={rowIndex}
                                style={{
                                    flexDirection: "row",
                                    justifyContent:
                                        "space-between",
                                    marginBottom: 12,
                                }}
                            >
                                {row.map(
                                    (key, keyIndex) => {
                                        if (key === "") {
                                            return (
                                                <View
                                                    key={keyIndex}
                                                    style={{
                                                        width: "31%",
                                                    }}
                                                />
                                            );
                                        }

                                        if (
                                            key ===
                                            "backspace"
                                        ) {
                                            return (
                                                <TouchableOpacity
                                                    key={
                                                        keyIndex
                                                    }
                                                    onPress={() =>
                                                        handleKeyPress(
                                                            "backspace"
                                                        )
                                                    }
                                                    disabled={
                                                        saving
                                                    }
                                                    style={{
                                                        width:
                                                            "31%",
                                                        height: 68,
                                                        borderRadius:
                                                            16,
                                                        backgroundColor:
                                                            "#EEF2F6",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                    activeOpacity={
                                                        0.7
                                                    }
                                                >
                                                    <Ionicons
                                                        name="backspace-outline"
                                                        size={24}
                                                        color="#374151"
                                                    />
                                                </TouchableOpacity>
                                            );
                                        }

                                        return (
                                            <TouchableOpacity
                                                key={
                                                    keyIndex
                                                }
                                                onPress={() =>
                                                    handleKeyPress(
                                                        key
                                                    )
                                                }
                                                disabled={
                                                    saving
                                                }
                                                style={{
                                                    width:
                                                        "31%",
                                                    height: 68,
                                                    borderRadius:
                                                        16,
                                                    backgroundColor:
                                                        "#F3F4F6",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                }}
                                                activeOpacity={
                                                    0.7
                                                }
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 26,
                                                        fontWeight:
                                                            "700",
                                                        color: "#111827",
                                                    }}
                                                >
                                                    {key}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }
                                )}
                            </View>
                        )
                    )}
                </View>

                {/* Security note */}
                <View
                    style={{
                        backgroundColor: "#FEF3C7",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "#FDE68A",
                        padding: 16,
                        marginTop: 8,
                        width: "100%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                        }}
                    >
                        <Ionicons
                            name="alert-circle-outline"
                            size={18}
                            color="#D97706"
                            style={{
                                marginRight: 8,
                                marginTop: 1,
                            }}
                        />

                        <Text
                            style={{
                                fontSize: 13,
                                color: "#92400E",
                                flex: 1,
                                lineHeight: 19,
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "700",
                                }}
                            >
                                Never share your PIN.
                            </Text>{" "}
                            HealthPass staff will never ask
                            for it. Avoid using your birthday
                            or sequential numbers.
                        </Text>
                    </View>
                </View>

                {/* Skip / back link */}
                <TouchableOpacity
                    onPress={
                        step === "confirm"
                            ? handleBackToCreate
                            : handleSkip
                    }
                    disabled={saving}
                    style={{
                        marginTop: 20,
                        marginBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            color: "#9CA3AF",
                            fontWeight: "600",
                            fontSize: 14,
                        }}
                    >
                        {step === "confirm"
                            ? "Start over"
                            : "Skip for now"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
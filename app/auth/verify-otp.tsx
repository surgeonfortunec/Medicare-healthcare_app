import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { account } from "@/lib/appwrite";

export default function VerifyOTP() {
    const { email, userId, challengeId } =
        useLocalSearchParams<{
            email: string;
            userId: string;
            challengeId?: string;
        }>();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");

    const [countdown, setCountdown] = useState(60);

    const inputRef = useRef<TextInput>(null);

    // -------------------------
    // COUNTDOWN
    // -------------------------

    useEffect(() => {
        if (countdown <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setCountdown((previous) => previous - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    // -------------------------
    // VERIFY OTP
    // -------------------------

    const handleVerifyOTP = async () => {
        setError("");

        if (!otp.trim()) {
            setError("Please enter the verification code.");
            return;
        }

        if (otp.length !== 6) {
            setError("Please enter the 6-digit verification code.");
            return;
        }

        if (!userId) {
            setError(
                "Your verification session is missing. Please sign up again."
            );
            return;
        }

        try {
            setLoading(true);

            console.log("VERIFYING EMAIL OTP...");
            console.log("USER ID:", userId);
            console.log("OTP LENGTH:", otp.length);
            console.log("CHALLENGE ID:", challengeId);

            /*
             * Appwrite Email OTP verification
             *
             * The 6-digit OTP entered by the user
             * is passed as the "secret".
             *
             * Appwrite then creates an authenticated
             * session for the user.
             */

            const session = await account.updateMagicURLSession({
                userId,
                secret: otp,
            });

            console.log("OTP VERIFIED SUCCESSFULLY");
            console.log("SESSION:", session);

            /*
             * Confirm the authenticated account.
             */
            const verifiedUser = await account.get();

            console.log("AUTHENTICATED USER:", verifiedUser);
            console.log(
                "EMAIL VERIFIED:",
                verifiedUser.emailVerification
            );

            /*
             * OTP verification succeeded.
             *
             * Continue to the welcome screen.
             */
            router.replace("/auth/welcome");
        } catch (error: any) {
            console.log("OTP VERIFICATION ERROR:", error);

            const errorMessage =
                error?.message ||
                "Invalid or expired verification code. Please try again.";

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------
    // RESEND OTP
    // -------------------------

    const handleResendOTP = async () => {
        if (countdown > 0 || resending) {
            return;
        }

        if (!userId || !email) {
            setError(
                "Your verification information is missing. Please sign up again."
            );
            return;
        }

        try {
            setError("");
            setResending(true);

            console.log("RESENDING EMAIL OTP...");

            const token = await account.createEmailToken({
                userId,
                email,
            });

            console.log("OTP RESENT SUCCESSFULLY:", token);

            setOtp("");
            setCountdown(60);

            Alert.alert(
                "Code sent",
                "A new verification code has been sent to your email."
            );
        } catch (error: any) {
            console.log("RESEND OTP ERROR:", error);

            setError(
                error?.message ||
                "Unable to resend the verification code. Please try again."
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Back */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    disabled={loading}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#12304A"
                    />
                </TouchableOpacity>

                {/* Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="mail-outline"
                        size={42}
                        color="#079B61"
                    />
                </View>

                {/* Header */}
                <Text style={styles.title}>
                    Verify your email
                </Text>

                <Text style={styles.subtitle}>
                    We've sent a 6-digit verification code to
                </Text>

                <Text style={styles.email}>
                    {email}
                </Text>

                {/* OTP */}
                <View style={styles.otpContainer}>
                    <TextInput
                        ref={inputRef}
                        value={otp}
                        onChangeText={(value) => {
                            const numericValue =
                                value
                                    .replace(/[^0-9]/g, "")
                                    .slice(0, 6);

                            setOtp(numericValue);
                            setError("");
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus
                        editable={!loading}
                        style={styles.otpInput}
                    />
                </View>

                {/* Error */}
                {error ? (
                    <Text style={styles.error}>
                        {error}
                    </Text>
                ) : null}

                {/* Verify */}
                <TouchableOpacity
                    style={[
                        styles.verifyButton,
                        loading &&
                        styles.buttonDisabled,
                    ]}
                    onPress={handleVerifyOTP}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="small"
                                color="#FFFFFF"
                            />

                            <Text
                                style={[
                                    styles.verifyText,
                                    styles.loadingText,
                                ]}
                            >
                                Verifying...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.verifyText}>
                            Verify email
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Resend */}
                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>
                        Didn't receive the code?
                    </Text>

                    <TouchableOpacity
                        onPress={handleResendOTP}
                        disabled={
                            countdown > 0 || resending || loading
                        }
                    >
                        <Text
                            style={[
                                styles.resendLink,
                                (countdown > 0 ||
                                    resending ||
                                    loading) &&
                                styles.resendDisabled,
                            ]}
                        >
                            {resending
                                ? "Sending..."
                                : countdown > 0
                                    ? `Resend in ${countdown}s`
                                    : "Resend code"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingTop: 55,
        paddingBottom: 40,
    },

    backButton: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: "#F5F8F9",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 50,
    },

    iconContainer: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: "#E8F7F1",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 30,
    },

    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#12304A",
        textAlign: "center",
    },

    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: "#526575",
        textAlign: "center",
        marginTop: 12,
    },

    email: {
        fontSize: 15,
        fontWeight: "700",
        color: "#12304A",
        textAlign: "center",
        marginTop: 5,
    },

    otpContainer: {
        marginTop: 35,
        alignItems: "center",
    },

    otpInput: {
        width: "100%",
        height: 65,
        borderWidth: 1,
        borderColor: "#D9E1E6",
        borderRadius: 14,
        textAlign: "center",
        fontSize: 28,
        fontWeight: "700",
        letterSpacing: 12,
        color: "#12304A",
    },

    error: {
        color: "#D64545",
        fontSize: 13,
        textAlign: "center",
        marginTop: 12,
    },

    verifyButton: {
        height: 55,
        borderRadius: 12,
        backgroundColor: "#079B61",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 28,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    loadingText: {
        marginLeft: 8,
    },

    verifyText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    resendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 28,
    },

    resendText: {
        color: "#526575",
        fontSize: 14,
    },

    resendLink: {
        color: "#079B61",
        fontSize: 14,
        fontWeight: "700",
        marginLeft: 5,
    },

    resendDisabled: {
        color: "#9AA8B2",
    },
});
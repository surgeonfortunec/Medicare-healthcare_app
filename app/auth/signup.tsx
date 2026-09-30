
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { account } from "@/lib/appwrite";

export default function SignUp() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignUp = async () => {
        setError("");

        // -------------------------
        // VALIDATION
        // -------------------------

        if (!fullName.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== repeatPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!agreeTerms) {
            setError(
                "Please agree to the Terms of Service and Privacy Policy."
            );
            return;
        }

        try {
            setLoading(true);

            // -------------------------
            // CREATE APPWRITE ACCOUNT
            // -------------------------

            const user = await account.create({
                userId: "unique()",
                email: email.trim().toLowerCase(),
                password: password,
                name: fullName.trim(),
            });

            console.log("APPWRITE ACCOUNT CREATED:", user);

            // -------------------------
            // ACCOUNT CREATED
            // -------------------------
            // OTP verification, welcome page,
            // and PIN creation have been removed.
            //
            // The user now goes directly to
            // the Sign In page.

            router.replace("/auth/sign-in");
        } catch (error: any) {
            console.log("SIGN UP ERROR:", error);

            if (error?.code === 409) {
                setError(
                    "An account with this email already exists. Please sign in."
                );
            } else {
                setError(
                    error?.message ||
                        "Something went wrong while creating your account."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={images.logo}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Create your account
                    </Text>

                    <Text style={styles.subtitle}>
                        One Platform, Healthcare You Can Find. Healthcare You Can Trust.
                    </Text>
                </View>

                {/* Full Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Full name
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter your full name"
                        placeholderTextColor="#9AA8B2"
                        autoCapitalize="words"
                    />
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Email address
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email address"
                        placeholderTextColor="#9AA8B2"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {/* Phone */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Phone number
                    </Text>

                    <View style={styles.phoneContainer}>
                        <View style={styles.countryCode}>
                            <Text style={styles.countryCodeText}>
                                +234
                            </Text>
                        </View>

                        <TextInput
                            style={styles.phoneInput}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            placeholderTextColor="#9AA8B2"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Password
                    </Text>

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Create a secure password"
                            placeholderTextColor="#9AA8B2"
                            secureTextEntry={!showPassword}
                        />

                        <TouchableOpacity
                            onPress={() =>
                                setShowPassword(!showPassword)
                            }
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={
                                    showPassword
                                        ? "eye-off-outline"
                                        : "eye-outline"
                                }
                                size={21}
                                color="#526575"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.hint}>
                        Use at least 8 characters with letters and numbers.
                    </Text>
                </View>

                {/* Repeat Password */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Repeat Password
                    </Text>

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            value={repeatPassword}
                            onChangeText={setRepeatPassword}
                            placeholder="Repeat your password"
                            placeholderTextColor="#9AA8B2"
                            secureTextEntry={!showRepeatPassword}
                        />

                        <TouchableOpacity
                            onPress={() =>
                                setShowRepeatPassword(
                                    !showRepeatPassword
                                )
                            }
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={
                                    showRepeatPassword
                                        ? "eye-off-outline"
                                        : "eye-outline"
                                }
                                size={21}
                                color="#526575"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Terms */}
                <View style={styles.termsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.checkbox,
                            agreeTerms && styles.checkboxActive,
                        ]}
                        onPress={() =>
                            setAgreeTerms(!agreeTerms)
                        }
                        activeOpacity={0.7}
                    >
                        {agreeTerms && (
                            <Ionicons
                                name="checkmark"
                                size={15}
                                color="#FFFFFF"
                            />
                        )}
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        I agree to the{" "}
                        <Text style={styles.link}>
                            Terms of Service
                        </Text>
                        {" "}and{" "}
                        <Text style={styles.link}>
                            Privacy Policy
                        </Text>
                    </Text>
                </View>

                {/* Error */}
                {error ? (
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                ) : null}

                {/* Create Account */}
                <TouchableOpacity
                    style={[
                        styles.createButton,
                        loading && styles.createButtonDisabled,
                    ]}
                    activeOpacity={0.8}
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    <Text style={styles.createButtonText}>
                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />

                    <Text style={styles.orText}>
                        or continue with
                    </Text>

                    <View style={styles.divider} />
                </View>

                {/* Google + Apple */}
                <View style={styles.socialContainer}>
                    {/* Google */}
                    <TouchableOpacity
                        style={styles.socialButton}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={icons.google}
                            className="w-5 h-5"
                            resizeMode="contain"
                        />

                        <Text style={styles.socialText}>
                            Google
                        </Text>
                    </TouchableOpacity>

                    {/* Apple */}
                    <TouchableOpacity
                        style={styles.socialButton}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="logo-apple"
                            size={20}
                            color="#111111"
                        />

                        <Text style={styles.socialText}>
                            Apple
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Login */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>
                        Already have an account?
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            router.replace("/auth/sign-in")
                        }
                        activeOpacity={0.7}
                    >
                        <Text style={styles.loginLink}>
                            Sign in
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

    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 35,
    },

    logoContainer: {
        alignItems: "flex-start",
        marginBottom: 35,
    },

    logo: {
        width: 250,
        height: 70,
    },

    header: {
        marginBottom: 28,
    },

    title: {
        fontSize: 35,
        fontWeight: "800",
        color: "#12304A",
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 18,
        lineHeight: 22,
        color: "#526575",
        maxWidth: 340,
    },

    inputGroup: {
        marginBottom: 25,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#12304A",
        marginBottom: 12,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: "#D9E1E6",
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 15,
        color: "#12304A",
        backgroundColor: "#FFFFFF",
    },

    phoneContainer: {
        height: 52,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#D9E1E6",
        borderRadius: 12,
        overflow: "hidden",
    },

    countryCode: {
        width: 68,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F8F9",
        borderRightWidth: 1,
        borderRightColor: "#D9E1E6",
    },

    countryCodeText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#12304A",
    },

    phoneInput: {
        flex: 1,
        paddingHorizontal: 14,
        fontSize: 15,
        color: "#12304A",
    },

    passwordContainer: {
        height: 52,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D9E1E6",
        borderRadius: 12,
        paddingHorizontal: 15,
    },

    passwordInput: {
        flex: 1,
        fontSize: 15,
        color: "#12304A",
    },

    hint: {
        fontSize: 12,
        color: "#7A8A95",
        marginTop: 6,
    },

    termsContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 2,
        marginBottom: 10,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: "#B7C3CA",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 9,
        marginTop: 1,
    },

    checkboxActive: {
        backgroundColor: "#079B61",
        borderColor: "#079B61",
    },

    termsText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
        color: "#526575",
    },

    link: {
        color: "#079B61",
        fontWeight: "600",
    },

    errorText: {
        color: "#D64545",
        fontSize: 13,
        lineHeight: 19,
        marginTop: 5,
        marginBottom: 5,
    },

    createButton: {
        height: 54,
        borderRadius: 12,
        backgroundColor: "#079B61",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },

    createButtonDisabled: {
        opacity: 0.6,
    },

    createButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 30,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E4EAED",
    },

    orText: {
        fontSize: 12,
        color: "#7A8A95",
        marginHorizontal: 12,
    },

    socialContainer: {
        flexDirection: "row",
        gap: 12,
        marginTop: 10,
    },

    socialButton: {
        flex: 1,
        height: 52,
        borderWidth: 1,
        borderColor: "#D9E1E6",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        gap: 9,
    },

    socialText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#12304A",
    },

    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },

    loginText: {
        fontSize: 14,
        color: "#526575",
    },

    loginLink: {
        fontSize: 14,
        fontWeight: "700",
        color: "#079B61",
        marginLeft: 5,
    },
});

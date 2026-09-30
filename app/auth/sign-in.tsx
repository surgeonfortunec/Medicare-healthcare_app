
import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { account } from "@/lib/appwrite";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        const cleanEmail = email.trim().toLowerCase();

        // ---------------------------------------------
        // 1. Validate form
        // ---------------------------------------------
        if (!cleanEmail || !password) {
            Alert.alert(
                "Missing information",
                "Please enter your email address and password."
            );
            return;
        }

        if (!cleanEmail.includes("@")) {
            Alert.alert(
                "Invalid email",
                "Please enter a valid email address."
            );
            return;
        }

        try {
            setLoading(true);

            console.log("SIGN IN STARTED");
            console.log("EMAIL:", cleanEmail);

            // ---------------------------------------------
            // 2. Check for an existing Appwrite session
            // ---------------------------------------------
            try {
                const existingUser = await account.get();

                console.log("EXISTING SESSION FOUND:", existingUser.email);

                // If the same user is already signed in,
                // go directly to the Home page.
                if (
                    existingUser.email &&
                    existingUser.email.toLowerCase() === cleanEmail
                ) {
                    console.log("USER ALREADY SIGNED IN");

                    router.replace("/(root)/(tabs)");
                    return;
                }

                // Different user is signed in.
                // Remove the old session before creating a new one.
                console.log("DIFFERENT USER SESSION FOUND");

                await account.deleteSession({
                    sessionId: "current",
                });

                console.log("OLD SESSION DELETED");
            } catch (error) {
                // No active session.
                console.log("NO ACTIVE SESSION");
            }

            // ---------------------------------------------
            // 3. Create Appwrite email/password session
            // ---------------------------------------------
            console.log("CREATING NEW SESSION...");

            const session =
                await account.createEmailPasswordSession({
                    email: cleanEmail,
                    password,
                });

            console.log("SESSION CREATED:", session.$id);

            // ---------------------------------------------
            // 4. Get the authenticated user
            // ---------------------------------------------
            const user = await account.get();

            console.log("AUTHENTICATED USER:", user);
            console.log("USER NAME:", user.name);
            console.log("USER EMAIL:", user.email);

            // ---------------------------------------------
            // 5. Successful sign in
            // ---------------------------------------------
            console.log("SIGN IN SUCCESSFUL");

            /*
             * The app now goes directly to Home.
             *
             * No:
             * - OTP
             * - Welcome page
             * - Create PIN
             * - Confirm PIN
             */

            router.replace("/(root)/(tabs)");
        } catch (error: any) {
            console.log("SIGN IN ERROR:", error);

            let message =
                "Unable to sign in. Please check your email and password.";

            if (error?.code === 401) {
                message =
                    "Incorrect email or password. Please check your email and password.";
            } else if (error?.code === 404) {
                message =
                    "No account was found with these details.";
            } else if (error?.code === 409) {
                message =
                    "An active session already exists. Please try again.";
            } else if (error?.message) {
                console.log(
                    "APPWRITE ERROR MESSAGE:",
                    error.message
                );
            }

            Alert.alert("Sign in failed", message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Logo */}
                <View className="px-7 pt-5">
                    <Image
                        source={images.logo}
                        className="w-[170px] h-[55px]"
                        resizeMode="contain"
                    />
                </View>

                {/* Header Image */}
                <View className="w-full h-[500px] mt-2">
                    <Image
                        source={images.signIn}
                        className="w-full h-full"
                        resizeMode="contain"
                    />
                </View>

                {/* Welcome Text */}
                <View className="px-7 mt-1">
                    <Text className="text-3xl font-rubik-bold text-black-300">
                        Welcome Back!
                    </Text>

                    <Text className="text-base font-rubik text-black-200 mt-2 leading-6">
                        Connecting Africa to better healthcare.
                    </Text>
                </View>

                {/* Sign In Form */}
                <View className="px-7 mt-7">

                    {/* Email */}
                    <Text className="text-base font-rubik-medium text-black-300 mb-2">
                        Email address
                    </Text>

                    <View className="h-[55px] border border-gray-200 rounded-xl flex-row items-center px-4 bg-white">
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color="#526575"
                        />

                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email address"
                            placeholderTextColor="#9AA6AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            className="flex-1 ml-3 text-base font-rubik text-black-300"
                        />
                    </View>

                    {/* Password */}
                    <View className="mt-5">
                        <Text className="text-base font-rubik-medium text-black-300 mb-2">
                            Password
                        </Text>

                        <View className="h-[55px] border border-gray-200 rounded-xl flex-row items-center px-4 bg-white">
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#526575"
                            />

                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                placeholderTextColor="#9AA6AF"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                className="flex-1 ml-3 text-base font-rubik text-black-300"
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                <Ionicons
                                    name={
                                        showPassword
                                            ? "eye-outline"
                                            : "eye-off-outline"
                                    }
                                    size={21}
                                    color="#526575"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Keep me signed in */}
                    <View className="flex-row items-center justify-between mt-4">
                        <TouchableOpacity
                            onPress={() =>
                                setKeepSignedIn(!keepSignedIn)
                            }
                            className="flex-row items-center"
                        >
                            <View
                                className={`w-5 h-5 rounded-md border items-center justify-center ${
    keepSignedIn
        ? "bg-[#079B61] border-[#079B61]"
        : "border-gray-300"
}`}
                            >
                                {keepSignedIn && (
                                    <Ionicons
                                        name="checkmark"
                                        size={14}
                                        color="#FFFFFF"
                                    />
                                )}
                            </View>

                            <Text className="ml-2 text-sm font-rubik text-black-200">
                                Keep me signed in
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text className="text-sm font-rubik-medium text-[#079B61]">
                                Forgot password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        onPress={handleSignIn}
                        disabled={loading}
                        className="h-[55px] bg-[#12304A] rounded-xl items-center justify-center mt-7"
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <View className="flex-row items-center">
                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />

                                <Text className="text-white text-base font-rubik-bold ml-2">
                                    Signing In...
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-white text-base font-rubik-bold">
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Continue With */}
                    <View className="flex-row items-center my-7">
                        <View className="flex-1 h-[1px] bg-gray-200" />

                        <Text className="mx-4 text-sm font-rubik text-black-200">
                            Continue with
                        </Text>

                        <View className="flex-1 h-[1px] bg-gray-200" />
                    </View>

                    {/* Google + Apple */}
                    <View className="flex-row gap-3">

                        {/* Google */}
                        <TouchableOpacity
                            className="flex-1 h-[52px] border border-gray-200 rounded-xl flex-row items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Image
                                source={icons.google}
                                className="w-5 h-5"
                                resizeMode="contain"
                            />

                            <Text className="ml-2 text-sm font-rubik-medium text-black-300">
                                Google
                            </Text>
                        </TouchableOpacity>

                        {/* Apple */}
                        <TouchableOpacity
                            className="flex-1 h-[52px] border border-gray-200 rounded-xl flex-row items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Image
                                source={icons.apple}
                                className="w-5 h-5"
                                resizeMode="contain"
                            />

                            <Text className="ml-2 text-sm font-rubik-medium text-black-300">
                                Apple
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/* Create Account */}
                    <View className="flex-row justify-center mt-7">
                        <Text className="text-sm font-rubik text-black-200">
                            Don't have an account?
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                router.push("/auth/signup")
                            }
                        >
                            <Text className="text-sm font-rubik-bold text-[#079B61] ml-1">
                                Create account
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;

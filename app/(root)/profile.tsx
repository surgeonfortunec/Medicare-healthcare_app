import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { account } from "@/lib/appwrite";

const Profile = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out of your HealthPass account?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoggingOut(true);

                            console.log("LOGOUT STARTED");

                            // Delete the current Appwrite session
                            await account.deleteSession({
                                sessionId: "current",
                            });

                            console.log("APPWRITE SESSION DELETED");

                            // Return to sign in
                            router.replace("/auth/sign-in");

                        } catch (error: any) {
                            console.log("LOGOUT ERROR:", error);

                            Alert.alert(
                                "Logout failed",
                                error?.message ||
                                "Unable to log out. Please try again."
                            );
                        } finally {
                            setLoggingOut(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            >
                {/* ================= HEADER ================= */}
                <View className="flex-row items-center justify-between border-b border-gray-100 px-5 pb-4 pt-4">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                            className="h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-[#F8FAFC]"
                        >
                            <Ionicons
                                name="chevron-back"
                                size={27}
                                color="#17213A"
                            />
                        </TouchableOpacity>

                        <Text className="ml-5 text-[24px] font-bold text-[#17213A]">
                            My Profile
                        </Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.7}>
                        <Text className="text-[16px] font-bold text-[#009F91]">
                            Edit
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ================= PROFILE ================= */}
                <View className="items-center px-5 pt-6">
                    {/* Avatar */}
                    <View className="relative">
                        <View className="h-[112px] w-[112px] items-center justify-center rounded-full bg-[#DDF7F4]">
                            <Ionicons
                                name="person"
                                size={58}
                                color="#009F91"
                            />
                        </View>

                        {/* Edit avatar button */}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#009F91]"
                        >
                            <Ionicons
                                name="pencil"
                                size={18}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text className="mt-5 text-[27px] font-bold text-[#17213A]">
                        Fortune Obumkelu
                    </Text>

                    <Text className="mt-1 text-[16px] text-[#7183A2]">
                        fortune.obumkelu@email.com
                    </Text>

                    <Text className="mt-2 text-[17px] font-bold text-[#009F91]">
                        +234 801 234 5678
                    </Text>
                </View>

                {/* ================= STATISTICS ================= */}
                <View className="mx-5 mt-8 flex-row rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
                    {/* Bookings */}
                    <View className="flex-1 items-center border-r border-gray-100">
                        <Text className="text-[29px] font-bold text-[#008F84]">
                            12
                        </Text>

                        <Text className="mt-1 text-[16px] text-[#7183A2]">
                            Bookings
                        </Text>
                    </View>

                    {/* Results */}
                    <View className="flex-1 items-center border-r border-gray-100">
                        <Text className="text-[29px] font-bold text-[#008F84]">
                            9
                        </Text>

                        <Text className="mt-1 text-[16px] text-[#7183A2]">
                            Results
                        </Text>
                    </View>

                    {/* Facilities */}
                    <View className="flex-1 items-center">
                        <Text className="text-[29px] font-bold text-[#008F84]">
                            5
                        </Text>

                        <Text className="mt-1 text-[16px] text-[#7183A2]">
                            Facilities
                        </Text>
                    </View>
                </View>

                {/* ================= HEALTHPASS ID ================= */}
                <View className="mx-5 mt-6 flex-row items-center rounded-[20px] border border-[#B8F1EB] bg-[#EEFCFA] px-5 py-4">
                    <View className="h-11 w-11 items-center justify-center">
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={29}
                            color="#008F84"
                        />
                    </View>

                    <View className="ml-3 flex-1">
                        <Text className="text-[16px] font-bold text-[#006F68]">
                            HealthPass ID
                        </Text>

                        <Text className="mt-1 text-[19px] font-bold tracking-wide text-[#008F84]">
                            HP-8821-4972-NGR
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="rounded-[15px] border-2 border-[#B8F1EB] bg-white px-5 py-3"
                    >
                        <Text className="text-[16px] font-bold text-[#008F84]">
                            Copy
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ================= PUSH NOTIFICATIONS ================= */}
                <View className="mx-5 mt-5 flex-row items-center rounded-[20px] border border-gray-100 bg-white px-5 py-5 shadow-sm">
                    <Text className="text-[30px]">
                        🔔
                    </Text>

                    <View className="ml-4 flex-1">
                        <Text className="text-[17px] font-bold text-[#17213A]">
                            Push Notifications
                        </Text>

                        <Text className="mt-1 text-[14px] text-[#7183A2]">
                            Results, bookings & reminders
                        </Text>
                    </View>

                    {/* Toggle */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                            setNotificationsEnabled(
                                !notificationsEnabled
                            )
                        }
                        className={`h-9 w-[62px] justify-center rounded-full px-1 ${
                            notificationsEnabled
                                ? "bg-[#00B7A8]"
                                : "bg-gray-300"
                        }`}
                    >
                        <View
                            className={`h-7 w-7 rounded-full bg-white ${
                                notificationsEnabled
                                    ? "self-end"
                                    : "self-start"
                            }`}
                        />
                    </TouchableOpacity>
                </View>

                {/* ================= ACCOUNT ================= */}
                <SectionTitle title="ACCOUNT" />

                <View className="mx-5 overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-sm">
                    <ProfileItem
                        icon="person"
                        title="Personal Information"
                        subtitle="Name, DOB, gender, blood group"
                        onPress={() => router.push("./personal-information")}
                    />

                    <ProfileItem
                        icon="medkit"
                        title="Medical Profile"
                        subtitle="Allergies, conditions, medications"
                        onPress={() => router.push("./medical-profile")}
                    />

                    <ProfileItem
                        icon="lock-closed"
                        title="Security & PIN"
                        subtitle="Password, transaction PIN, biometrics"
                        onPress={() => router.push("./security-pin")}
                    />
                </View>

                {/* ================= PREFERENCES ================= */}
                <SectionTitle title="PREFERENCES" />

                <View className="mx-5 overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-sm">
                    <ProfileItem
                        icon="notifications"
                        title="Notification Settings"
                        subtitle="Results, reminders, promotions"
                        onPress={() => router.push("./notification-settings")}
                    />

                    <ProfileItem
                        icon="location"
                        title="Saved Locations"
                        subtitle="3 locations saved"
                        onPress={() => router.push("./saved-locations")}
                    />

                    <ProfileItem
                        icon="card"
                        title="Payment Methods"
                        subtitle="Cards, bank accounts"
                        onPress={() => router.push("./payment-methods")}
                    />
                </View>

                {/* ================= SUPPORT ================= */}
                <SectionTitle title="SUPPORT" />

                <View className="mx-5 overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-sm">
                    <ProfileItem
                        icon="chatbubble-ellipses"
                        title="Help & Support"
                        subtitle="Chat with us, FAQs"
                        onPress={() => router.replace("./help")}
                    />

                    <ProfileItem
                        icon="document-text"
                        title="Terms & Privacy Policy"
                        subtitle="Legal documents"
                        onPress={() => router.push("./terms-privacy")}
                    />

                    <ProfileItem
                        icon="star"
                        title="Rate HealthPass"
                        subtitle="Share your feedback"
                        onPress={() => {}}
                    />
                </View>

                {/* ================= LOGOUT ================= */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleLogout}
                    disabled={loggingOut}
                    className="mx-5 mt-7 mb-5 flex-row items-center justify-center rounded-2xl bg-red-50 py-4"
                >
                    <Ionicons
                        name="log-out-outline"
                        size={21}
                        color="#DC2626"
                    />

                    <Text className="ml-2 text-[15px] font-bold text-red-600">
                        {loggingOut ? "Logging Out..." : "Log Out"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({ title }: { title: string }) => {
    return (
        <Text className="mb-3 ml-5 mt-8 text-[14px] font-bold tracking-[1.5px] text-[#8BA0BD]">
            {title}
        </Text>
    );
};

/* =========================================================
   PROFILE ITEM
========================================================= */

interface ProfileItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    onPress?: () => void;
}

const ProfileItem = ({
                         icon,
                         title,
                         subtitle,
                         onPress,
                     }: ProfileItemProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className="flex-row items-center border-b border-gray-100 px-5 py-5"
        >
            {/* Icon */}
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF9F7]">
                <Ionicons
                    name={icon}
                    size={23}
                    color="#008F84"
                />
            </View>

            {/* Text */}
            <View className="ml-4 flex-1">
                <Text className="text-[16px] font-bold text-[#17213A]">
                    {title}
                </Text>

                <Text className="mt-1 text-[13px] text-[#8BA0BD]">
                    {subtitle}
                </Text>
            </View>

            {/* Arrow */}
            <Ionicons
                name="chevron-forward"
                size={21}
                color="#B6C5D8"
            />
        </TouchableOpacity>
    );
};

export default Profile;
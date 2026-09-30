import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Modal,
    ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { account } from "@/lib/appwrite";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type Category = {
    title: string;
    icon?: IconName | ImageSourcePropType;
    emoji?: string;
};

const categories = [
    {
        title: "Laboratory",
        subtitle: "Blood tests & more",
        emoji: "🧪",
    },
    {
        title: "Radiology",
        subtitle: "X-ray, CT, MRI & more",
        emoji: "🩻",
    },
    {
        title: "Pharmacy",
        subtitle: "Drugs & equipment",
        emoji: "💊",
    },
    {
        title: "Health Check",
        subtitle: "General screening",
        emoji: "🩺",
    },
    {
        title: "Equipment",
        subtitle: "Medical devices",
        emoji: "🦽",
    },
];

const popularSearches = [
    "MRI",
    "CT Scan",
    "Ultrasound",
    "X-Ray",
    "Blood Test",
    "Mammogram",
    "Paracetamol",
    "Glucometer",
];

const nigerianStates = [
    "Abuja (FCT)",
    "Lagos",
    "Kano",
    "Rivers",
    "Oyo",
    "Kaduna",
    "Enugu",
    "Delta",
    "Anambra",
    "Ogun",
    "Edo",
    "Plateau",
    "Cross River",
    "Imo",
    "Akwa Ibom",
];

const centres = [
    {
        name: "Echolab Radiology & Laboratory Services",
        type: "Diagnostic",
        location: "Garki",
        rating: "4.8",
        distance: "3.7 km",
        services: "MRI · CT · X-Ray · Laboratory",
        price: "₦20,000",
        status: "Verified",
        icon: "scan-outline" as const,
        image:
            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600",
        description:
            "Echolab Radiology & Laboratory Services is a diagnostic healthcare facility providing imaging and laboratory services to patients in Abuja. Patients can access diagnostic investigations and receive their results through the facility.",
    },
    {
        name: "H-Medix Pharmacy",
        type: "Pharmacy",
        location: "Wuse II",
        rating: "4.7",
        distance: "1.8 km",
        services: "Prescription · OTC · Healthcare",
        price: "₦850",
        status: "Verified",
        icon: "medical-outline" as const,
        image:
            "https://images.unsplash.com/photo-1631980839324-fdfabbf1a573?w=600",
        description:
            "H-Medix Pharmacy provides prescription medicines, over-the-counter products and general healthcare supplies. Customers can access medicines and healthcare products from the facility.",
    },
    {
        name: "Zenith Health Laboratories",
        type: "Laboratory",
        location: "Garki",
        rating: "4.6",
        distance: "3.7 km",
        services: "Blood Tests · Urinalysis · Hormones",
        price: "₦4,500",
        status: "Verified",
        icon: "flask-outline" as const,
        image:
            "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600",
        description:
            "Zenith Health Laboratories provides laboratory diagnostic services including blood investigations, urinalysis and hormone testing for patients.",
    },
    {
        name: "Everight Diagnostic & Laboratory Services",
        type: "Radiology",
        location: "Wuse II",
        rating: "4.9",
        distance: "2.4 km",
        services: "MRI · CT · X-Ray · Ultrasound",
        price: "₦18,500",
        status: "Verified",
        icon: "scan-outline" as const,
        image:
            "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600",
        description:
            "Everight Diagnostic & Laboratory Services provides diagnostic imaging services including MRI, CT, X-ray and ultrasound examinations.",
    },
    {
        name: "Skyle Medical Tech",
        type: "Medical Equipment",
        location: "Utako",
        rating: "4.8",
        distance: "4.1 km",
        services: "Medical Devices · Equipment · Technology",
        price: "₦850",
        status: "Verified",
        icon: "medical-outline" as const,
        image:
            "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600",
        description:
            "Skyle Medical Tech provides medical devices, equipment and healthcare technology solutions for healthcare professionals and facilities.",
    },
];

const offers = [
    {
        id: "1",
        title: "20% off Executive Health Check",
        provider: "Echolab Radiology & Laboratory Services",
        expiry: "Ends 31 Aug 2026",
        background: "#EFFBF9",
        border: "#BCECE5",
        iconColor: "#079B8F",
    },
    {
        id: "2",
        title: "Free delivery on orders over ₦5,000",
        provider: "H-Medix Pharmacy",
        expiry: "Ongoing",
        background: "#FFF9E9",
        border: "#F9DFAD",
        iconColor: "#D97706",
    },
    {
        id: "3",
        title: "₦5,000 off first MRI booking",
        provider: "Echolab Radiology & Laboratory Services",
        expiry: "Limited offer",
        background: "#EFF6FF",
        border: "#C7DDF8",
        iconColor: "#2563EB",
    },
];

const Home = () => {
    const router = useRouter();

    const [location, setLocation] = useState("Abuja, Nigeria");
    const [showLocationModal, setShowLocationModal] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const [selectedCentre, setSelectedCentre] = useState<
        (typeof centres)[number] | null
    >(null);

    const [userName, setUserName] = useState("User");
    const [greeting, setGreeting] = useState("Good morning");

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return "Good morning";
        }

        if (hour >= 12 && hour < 17) {
            return "Good afternoon";
        }

        return "Good evening";
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await account.get();

                const firstName = user.name?.trim().split(" ")[0];

                if (firstName) {
                    setUserName(firstName);
                }

                setGreeting(getGreeting());
            } catch (error) {
                console.error("Error loading user:", error);
            }
        };

        loadUser();
    }, []);

    const getFacilitiesForCategory = (category: string) => {
        switch (category) {
            case "Laboratory":
                return centres.filter(
                    (centre) =>
                        centre.type === "Laboratory" ||
                        centre.services.toLowerCase().includes("laboratory")
                );

            case "Radiology":
                return centres.filter(
                    (centre) =>
                        centre.type === "Radiology" ||
                        centre.type === "Diagnostic" ||
                        centre.services.toLowerCase().includes("mri") ||
                        centre.services.toLowerCase().includes("ct")
                );

            case "Pharmacy":
                return centres.filter(
                    (centre) =>
                        centre.type === "Pharmacy" ||
                        centre.services.toLowerCase().includes("prescription")
                );

            case "Health Check":
                return centres.filter(
                    (centre) =>
                        centre.type === "Diagnostic" ||
                        centre.services.toLowerCase().includes("health")
                );

            case "Equipment":
                return centres.filter(
                    (centre) =>
                        centre.type === "Medical Equipment" ||
                        centre.services.toLowerCase().includes("equipment") ||
                        centre.services.toLowerCase().includes("devices")
                );

            default:
                return centres;
        }
    };

    const selectedCategoryFacilities = selectedCategory
        ? getFacilitiesForCategory(selectedCategory)
        : [];

    return (
        <SafeAreaView className="flex-1 bg-[#F7FAFC]">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* HEADER */}
                <View className="px-5 pt-4">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="mt-1 text-[24px] font-bold text-gray-900">
                                {greeting}, {userName} 👋
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-3">
                            <TouchableOpacity
                                className="h-11 w-11 items-center justify-center rounded-full bg-white"
                                activeOpacity={0.7}
                                onPress={() => router.push("/notification")}
                            >
                                <Ionicons
                                    name="notifications-outline"
                                    size={22}
                                    color="#168C82"
                                />

                                <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#DFF4F1]"
                                activeOpacity={0.7}
                                onPress={() => router.push("/profile")}
                            >
                                <Image
                                    source={icons.person}
                                    className="h-5 w-5"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* LOCATION */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowLocationModal(true)}
                        className="mt-4 flex-row items-center self-start rounded-full bg-[#E8F7F5] px-4 py-2"
                    >
                        <Ionicons
                            name="location-outline"
                            size={17}
                            color="#168C82"
                        />

                        <Text className="ml-1 text-sm font-medium text-[#168C82]">
                            {location}
                        </Text>

                        <TouchableOpacity
                            onPress={() => setShowLocationModal(true)}
                            className="ml-2"
                        >
                            <Text className="text-sm font-semibold text-[#168C82]">
                                Change
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                {/* SEARCH */}
                <View className="mx-5 mt-5 flex-row items-center rounded-2xl bg-white px-4 py-3.5">
                    <Ionicons
                        name="search-outline"
                        size={21}
                        color="#7B8794"
                    />

                    <TextInput
                        placeholder="Search for test, scan, drugs etc"
                        placeholderTextColor="#9AA5B1"
                        className="ml-3 flex-1 text-[14px] text-gray-900"
                    />

                    <TouchableOpacity>
                        <Ionicons
                            name="options-outline"
                            size={21}
                            color="#168C82"
                        />
                    </TouchableOpacity>
                </View>

                {/* CATEGORIES */}
                <View className="mt-6">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {categories.map((category, index) => (
                            <TouchableOpacity
                                key={category.title}
                                onPress={() =>
                                    setSelectedCategory(category.title)
                                }
                                activeOpacity={0.8}
                                className={`mr-3 w-[142px] rounded-2xl bg-white p-4 ${
                                    index === categories.length - 1
                                        ? "mr-0"
                                        : ""
                                }`}
                            >
                                <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F5]">
                                    {category.emoji ? (
                                        <Text className="text-2xl">
                                            {category.emoji}
                                        </Text>
                                    ) : typeof category.emoji === "string" ? (
                                        <Ionicons
                                            name={category.emoji as IconName}
                                            size={22}
                                            color="#52637D"
                                        />
                                    ) : (
                                        <Image
                                            source={
                                                category.emoji as ImageSourcePropType
                                            }
                                            resizeMode="contain"
                                            className="h-6 w-6"
                                        />
                                    )}
                                </View>

                                <Text className="mt-3 text-[14px] font-bold text-gray-900">
                                    {category.title}
                                </Text>

                                <Text className="mt-1 text-[11px] leading-4 text-gray-500">
                                    {category.subtitle}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* POPULAR SEARCHES */}
                <View className="mt-7">
                    <View className="mb-3 flex-row items-center justify-between px-5">
                        <Text className="text-[18px] font-bold text-gray-900">
                            Popular searches
                        </Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {popularSearches.map((item) => (
                            <TouchableOpacity
                                key={item}
                                className="mr-2 rounded-full border border-gray-200 bg-white px-4 py-2.5"
                            >
                                <Text className="text-[12px] font-medium text-gray-700">
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* HEALTH COMPANION CARDS */}
                <View className="mt-7">
                    <Text className="px-5 text-[20px] font-bold text-[#17233D]">
                        Your Health Companion
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            paddingTop: 16,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => {
                                router.push("/ai-insight");
                            }}
                            className="mr-4 h-[170px] w-[300px] rounded-[28px] bg-[#6339E8] p-5"
                        >
                            <View className="flex-row items-center justify-between">
                                <Text className="text-[34px]">🤖</Text>

                                <View className="h-12 w-12 items-center justify-center rounded-full bg-[#FFFFFF30]">
                                    <Ionicons
                                        name="chevron-forward"
                                        size={22}
                                        color="#FFFFFF"
                                    />
                                </View>
                            </View>

                            <Text className="mt-3 text-[24px] font-bold text-white">
                                AI Health Insights
                            </Text>

                            <Text className="mt-1 text-[18px] text-[#DCD3FF]">
                                Ask your health assistant
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => {
                                router.push("/vital");
                            }}
                            className="h-[170px] w-[300px] rounded-[28px] bg-[#079B8F] p-5"
                        >
                            <View className="flex-row items-center justify-between">
                                <Text className="text-[34px]">💗</Text>

                                <View className="h-12 w-12 items-center justify-center rounded-full bg-[#FFFFFF30]">
                                    <Ionicons
                                        name="chevron-forward"
                                        size={22}
                                        color="#FFFFFF"
                                    />
                                </View>
                            </View>

                            <Text className="mt-3 text-[24px] font-bold text-white">
                                Vital Signs
                            </Text>

                            <Text className="mt-1 text-[18px] text-[#C2F4E8]">
                                Track & monitor health
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* NEARBY CENTRES */}
                <View className="mt-8">
                    <View className="mb-4 flex-row items-center justify-between px-5">
                        <Text className="text-[18px] font-bold text-gray-900">
                            Healthcare centres near you
                        </Text>

                        <TouchableOpacity>
                            <Text className="text-sm font-semibold text-[#168C82]">
                                See all
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {centres.map((centre) => (
                            <TouchableOpacity
                                key={centre.name}
                                activeOpacity={0.85}
                                onPress={() => setSelectedCentre(centre)}
                                className="mr-4 w-[280px] overflow-hidden rounded-2xl bg-white"
                            >
                                <View className="h-[125px] items-center justify-center bg-[#EAF7F5]">
                                    <Image
                                        source={{ uri: centre.image }}
                                        resizeMode="cover"
                                        className="h-full w-full"
                                    />

                                    <View className="absolute left-3 top-3 flex-row items-center rounded-full bg-white px-2.5 py-1">
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={13}
                                            color="#168C82"
                                        />

                                        <Text className="ml-1 text-[10px] font-semibold text-[#168C82]">
                                            {centre.status}
                                        </Text>
                                    </View>
                                </View>

                                <View className="p-4">
                                    <Text
                                        numberOfLines={1}
                                        className="text-[15px] font-bold text-gray-900"
                                    >
                                        {centre.name}
                                    </Text>

                                    <View className="mt-2 flex-row items-center">
                                        <Text className="text-[11px] text-gray-500">
                                            {centre.type}
                                        </Text>

                                        <Text className="mx-1 text-gray-300">
                                            ·
                                        </Text>

                                        <Text className="text-[11px] text-gray-500">
                                            {centre.location}
                                        </Text>
                                    </View>

                                    <View className="mt-2 flex-row items-center">
                                        <Ionicons
                                            name="star"
                                            size={13}
                                            color="#F59E0B"
                                        />

                                        <Text className="ml-1 text-[11px] font-semibold text-gray-700">
                                            {centre.rating}
                                        </Text>

                                        <Text className="mx-1 text-gray-300">
                                            ·
                                        </Text>

                                        <Text className="text-[11px] text-gray-500">
                                            {centre.distance}
                                        </Text>
                                    </View>

                                    <Text
                                        numberOfLines={1}
                                        className="mt-3 text-[11px] text-gray-500"
                                    >
                                        {centre.services}
                                    </Text>

                                    <View className="mt-4 flex-row items-end justify-between">
                                        <View>
                                            <Text className="text-[10px] text-gray-400">
                                                From
                                            </Text>

                                            <Text className="mt-0.5 text-[15px] font-bold text-gray-900">
                                                {centre.price}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() =>
                                                setSelectedCentre(centre)
                                            }
                                            className="rounded-lg bg-[#168C82] px-4 py-2"
                                        >
                                            <Text className="text-[11px] font-bold text-white">
                                                View
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* PRICE COMPARE */}
                <View className="mx-5 mt-8 overflow-hidden rounded-2xl bg-[#DFF4F1] p-5">
                    <View className="flex-row items-center">
                        <View className="h-12 w-12 items-center justify-center rounded-xl bg-white">
                            <Ionicons
                                name="pricetags-outline"
                                size={25}
                                color="#168C82"
                            />
                        </View>

                        <View className="ml-3 flex-1">
                            <Text className="text-[17px] font-bold text-gray-900">
                                Price Compare
                            </Text>

                            <Text className="mt-1 text-[11px] leading-4 text-gray-600">
                                Compare prices before you book
                            </Text>
                        </View>
                    </View>

                    <Text className="mt-4 text-[12px] leading-5 text-gray-600">
                        Find the best diagnostic prices from verified
                        facilities across Nigeria.
                    </Text>

                    <TouchableOpacity className="mt-4 self-start rounded-xl bg-[#168C82] px-5 py-3">
                        <Text className="text-[12px] font-bold text-white">
                            Compare prices
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* SPECIAL OFFERS */}
                <View className="mt-2">
                    <View className="mt-7 flex-row items-center justify-between px-5">
                        <Text className="text-[18px] font-bold tracking-[1.5px] text-[#627692]">
                            SPECIAL OFFERS
                        </Text>

                        <TouchableOpacity>
                            <Text className="text-[18px] font-bold text-[#079B8F]">
                                See all
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 38,
                            paddingTop: 25,
                        }}
                    >
                        {offers.map((offer) => (
                            <View
                                key={offer.id}
                                style={{
                                    backgroundColor: offer.background,
                                    borderColor: offer.border,
                                }}
                                className="mr-5 h-[200px] w-[400px] rounded-[28px] border-[3px] p-7"
                            >
                                <View className="flex-row items-center">
                                    <View
                                        style={{
                                            backgroundColor: offer.iconColor,
                                        }}
                                        className="h-10 w-10 items-center justify-center rounded-full"
                                    >
                                        <Ionicons
                                            name="heart-outline"
                                            size={22}
                                            color="white"
                                        />
                                    </View>

                                    <Text
                                        style={{ color: offer.iconColor }}
                                        className="ml-3 text-[17px] font-bold tracking-[1.5px]"
                                    >
                                        Limited
                                    </Text>
                                </View>

                                <Text className="mt-5 text-[23px] font-bold leading-8 text-[#17233D]">
                                    {offer.title}
                                </Text>

                                <Text className="mt-3 text-[17px] text-[#657C9D]">
                                    {offer.provider}
                                </Text>

                                <View className="mt-auto flex-row items-center justify-between">
                                    <Text className="text-[16px] text-[#91A5C2]">
                                        {offer.expiry}
                                    </Text>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: offer.iconColor,
                                        }}
                                        className="rounded-2xl px-5 py-3"
                                        activeOpacity={0.8}
                                    >
                                        <Text className="text-[16px] font-bold text-white">
                                            Claim
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* UPCOMING APPOINTMENT */}
                <View className="mt-8 px-5">
                    <Text className="mb-4 text-[18px] font-bold text-gray-900">
                        Upcoming appointment
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => router.push("/bookings")}
                        className="rounded-2xl bg-white p-5"
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#E8F7F5]">
                                    <Ionicons
                                        name="calendar-outline"
                                        size={21}
                                        color="#168C82"
                                    />
                                </View>

                                <View className="ml-3">
                                    <Text className="text-[15px] font-bold text-gray-900">
                                        Echolab Radiology & Laboratory Services
                                    </Text>

                                    <Text className="mt-1 text-[11px] text-gray-500">
                                        Confirmed
                                    </Text>
                                </View>
                            </View>

                            <View className="rounded-full bg-[#E8F7F5] px-2.5 py-1">
                                <Text className="text-[10px] font-semibold text-[#168C82]">
                                    Confirmed
                                </Text>
                            </View>
                        </View>

                        <View className="mt-5 border-t border-gray-100 pt-4">
                            <Text className="text-[14px] font-semibold text-gray-900">
                                Abdominal Ultrasound
                            </Text>

                            <View className="mt-2 flex-row items-center">
                                <Ionicons
                                    name="calendar-outline"
                                    size={14}
                                    color="#7B8794"
                                />

                                <Text className="ml-2 text-[11px] text-gray-500">
                                    Tue, 19 Aug 2026
                                </Text>

                                <Ionicons
                                    name="time-outline"
                                    size={14}
                                    color="#7B8794"
                                    style={{ marginLeft: 15 }}
                                />

                                <Text className="ml-2 text-[11px] text-gray-500">
                                    10:30 AM
                                </Text>
                            </View>

                            <View className="mt-2 flex-row items-center">
                                <Ionicons
                                    name="location-outline"
                                    size={14}
                                    color="#7B8794"
                                />

                                <Text className="ml-2 text-[11px] text-gray-500">
                                    Wuse II, Abuja
                                </Text>
                            </View>

                            <View className="mt-4 self-start">
                                <Text className="text-[12px] font-bold text-[#168C82]">
                                    View appointment
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* HEALTH RECORDS */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push("/records")}
                    className="mx-5 mt-8 overflow-hidden rounded-2xl bg-[#123F3B] p-5"
                >
                    <View className="flex-row items-center">
                        <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                            <Ionicons
                                name="wallet-outline"
                                size={24}
                                color="white"
                            />
                        </View>

                        <View className="ml-3 flex-1">
                            <Text className="text-[17px] font-bold text-white">
                                Your Health Records
                            </Text>

                            <Text className="mt-1 text-[11px] text-white/70">
                                Secure Health Records
                            </Text>
                        </View>
                    </View>

                    <Text className="mt-4 text-[12px] leading-5 text-white/70">
                        Securely access your reports and health records
                    </Text>

                    <View className="mt-5 flex-row justify-between">
                        <View className="flex-1">
                            <Ionicons
                                name="flask-outline"
                                size={22}
                                color="white"
                            />

                            <Text className="mt-2 text-[20px] font-bold text-white">
                                4
                            </Text>

                            <Text className="mt-1 text-[10px] text-white/60">
                                Laboratory Results
                            </Text>
                        </View>

                        <View className="flex-1">
                            <Ionicons
                                name="scan-outline"
                                size={22}
                                color="white"
                            />

                            <Text className="mt-2 text-[20px] font-bold text-white">
                                2
                            </Text>

                            <Text className="mt-1 text-[10px] text-white/60">
                                Radiology Reports
                            </Text>
                        </View>

                        <View className="flex-1">
                            <Ionicons
                                name="document-text-outline"
                                size={22}
                                color="white"
                            />

                            <Text className="mt-2 text-[20px] font-bold text-white">
                                7
                            </Text>

                            <Text className="mt-1 text-[10px] text-white/60">
                                Medical Records
                            </Text>
                        </View>
                    </View>

                    <View className="mt-5 border-t border-white/10 pt-4">
                        <View className="flex-row items-center">
                            <Ionicons
                                name="lock-closed-outline"
                                size={14}
                                color="white"
                            />

                            <Text className="ml-2 text-[10px] text-white/70">
                                Your records are encrypted and access-controlled
                            </Text>
                        </View>

                        <Text className="mt-2 text-[11px] font-semibold text-white">
                            Patient-controlled records
                        </Text>

                        <Text className="mt-1 text-[10px] text-white/60">
                            · You control who can access your records
                        </Text>
                    </View>

                    <View className="mt-5 items-center rounded-xl bg-white py-3">
                        <Text className="text-[12px] font-bold text-[#123F3B]">
                            Open Health Records
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            {/* SERVICE FACILITIES MODAL */}
            <Modal
                visible={selectedCategory !== null}
                animationType="slide"
                transparent
                onRequestClose={() => setSelectedCategory(null)}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View className="max-h-[80%] rounded-t-3xl bg-white px-5 pb-8 pt-5">
                        <View className="flex-row items-center justify-between pb-5">
                            <View>
                                <Text className="text-[20px] font-bold text-gray-900">
                                    {selectedCategory}
                                </Text>

                                <Text className="mt-1 text-[12px] text-gray-500">
                                    Facilities offering this service
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => setSelectedCategory(null)}
                                className="h-9 w-9 items-center justify-center rounded-full bg-gray-100"
                            >
                                <Ionicons
                                    name="close"
                                    size={21}
                                    color="#7B8794"
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 10 }}
                        >
                            {selectedCategoryFacilities.length > 0 ? (
                                selectedCategoryFacilities.map((centre) => (
                                    <TouchableOpacity
                                        key={centre.name}
                                        activeOpacity={0.85}
                                        onPress={() => {
                                            setSelectedCategory(null);
                                            setSelectedCentre(centre);
                                        }}
                                        className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white"
                                    >
                                        <View className="flex-row">
                                            <Image
                                                source={{
                                                    uri: centre.image,
                                                }}
                                                resizeMode="cover"
                                                className="h-[105px] w-[105px]"
                                            />

                                            <View className="flex-1 p-3">
                                                <View className="flex-row items-start justify-between">
                                                    <Text
                                                        numberOfLines={2}
                                                        className="mr-2 flex-1 text-[14px] font-bold text-gray-900"
                                                    >
                                                        {centre.name}
                                                    </Text>

                                                    <Ionicons
                                                        name="chevron-forward"
                                                        size={18}
                                                        color="#168C82"
                                                    />
                                                </View>

                                                <View className="mt-1 flex-row items-center">
                                                    <Text className="text-[11px] text-gray-500">
                                                        {centre.type}
                                                    </Text>

                                                    <Text className="mx-1 text-gray-300">
                                                        ·
                                                    </Text>

                                                    <Text className="text-[11px] text-gray-500">
                                                        {centre.location}
                                                    </Text>
                                                </View>

                                                <View className="mt-2 flex-row items-center">
                                                    <Ionicons
                                                        name="star"
                                                        size={12}
                                                        color="#F59E0B"
                                                    />

                                                    <Text className="ml-1 text-[11px] font-semibold text-gray-700">
                                                        {centre.rating}
                                                    </Text>

                                                    <Text className="mx-1 text-gray-300">
                                                        ·
                                                    </Text>

                                                    <Text className="text-[11px] text-gray-500">
                                                        {centre.distance}
                                                    </Text>
                                                </View>

                                                <Text
                                                    numberOfLines={1}
                                                    className="mt-2 text-[10px] text-gray-500"
                                                >
                                                    {centre.services}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View className="items-center py-10">
                                    <Text className="text-[15px] font-semibold text-gray-700">
                                        No facilities found
                                    </Text>

                                    <Text className="mt-2 text-center text-[12px] text-gray-500">
                                        There are currently no facilities
                                        available for this service.
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* FACILITY DETAILS MODAL */}
            <Modal
                visible={selectedCentre !== null}
                animationType="slide"
                transparent
                onRequestClose={() => setSelectedCentre(null)}
            >
                <View className="flex-1 justify-end bg-black/40">
                    {selectedCentre && (
                        <View className="max-h-[88%] rounded-t-3xl bg-white">
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 35 }}
                            >
                                {/* FACILITY IMAGE */}
                                <View className="relative h-[210px] w-full overflow-hidden rounded-t-3xl bg-[#EAF7F5]">
                                    <Image
                                        source={{
                                            uri: selectedCentre.image,
                                        }}
                                        resizeMode="cover"
                                        className="h-full w-full"
                                    />

                                    <TouchableOpacity
                                        onPress={() =>
                                            setSelectedCentre(null)
                                        }
                                        className="absolute right-5 top-5 h-10 w-10 items-center justify-center rounded-full bg-white/95"
                                    >
                                        <Ionicons
                                            name="close"
                                            size={23}
                                            color="#52637D"
                                        />
                                    </TouchableOpacity>

                                    <View className="absolute bottom-4 left-5 flex-row items-center rounded-full bg-white px-3 py-1.5">
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={15}
                                            color="#168C82"
                                        />

                                        <Text className="ml-1 text-[11px] font-semibold text-[#168C82]">
                                            {selectedCentre.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* FACILITY INFORMATION */}
                                <View className="px-5 pt-5">
                                    <Text className="text-[22px] font-bold text-gray-900">
                                        {selectedCentre.name}
                                    </Text>

                                    <View className="mt-2 flex-row items-center">
                                        <Text className="text-[12px] text-gray-500">
                                            {selectedCentre.type}
                                        </Text>

                                        <Text className="mx-2 text-gray-300">
                                            ·
                                        </Text>

                                        <Ionicons
                                            name="location-outline"
                                            size={14}
                                            color="#7B8794"
                                        />

                                        <Text className="ml-1 text-[12px] text-gray-500">
                                            {selectedCentre.location}
                                        </Text>
                                    </View>

                                    {/* RATING */}
                                    <View className="mt-3 flex-row items-center">
                                        <Ionicons
                                            name="star"
                                            size={15}
                                            color="#F59E0B"
                                        />

                                        <Text className="ml-1 text-[12px] font-semibold text-gray-700">
                                            {selectedCentre.rating}
                                        </Text>

                                        <Text className="mx-2 text-gray-300">
                                            ·
                                        </Text>

                                        <Text className="text-[12px] text-gray-500">
                                            {selectedCentre.distance}
                                        </Text>
                                    </View>

                                    {/* DESCRIPTION */}
                                    <View className="mt-6">
                                        <Text className="text-[17px] font-bold text-gray-900">
                                            About this facility
                                        </Text>

                                        <Text className="mt-2 text-[13px] leading-6 text-gray-600">
                                            {selectedCentre.description}
                                        </Text>
                                    </View>

                                    {/* SERVICES */}
                                    <View className="mt-6">
                                        <Text className="text-[17px] font-bold text-gray-900">
                                            Services
                                        </Text>

                                        <View className="mt-3 rounded-2xl bg-[#F7FAFC] p-4">
                                            {selectedCentre.services
                                                .split(" · ")
                                                .map((service, index) => (
                                                    <View
                                                        key={service}
                                                        className={`flex-row items-center ${
                                                            index === 0
                                                                ? ""
                                                                : "mt-3"
                                                        }`}
                                                    >
                                                        <View className="h-7 w-7 items-center justify-center rounded-full bg-[#E8F7F5]">
                                                            <Ionicons
                                                                name="checkmark"
                                                                size={15}
                                                                color="#168C82"
                                                            />
                                                        </View>

                                                        <Text className="ml-3 text-[13px] font-medium text-gray-700">
                                                            {service}
                                                        </Text>
                                                    </View>
                                                ))}
                                        </View>
                                    </View>

                                    {/* PRICE */}
                                    <View className="mt-6 flex-row items-center justify-between rounded-2xl bg-[#E8F7F5] p-4">
                                        <View>
                                            <Text className="text-[11px] text-gray-500">
                                                Services from
                                            </Text>

                                            <Text className="mt-1 text-[18px] font-bold text-gray-900">
                                                {selectedCentre.price}
                                            </Text>
                                        </View>

                                        <View className="flex-row items-center">
                                            <Ionicons
                                                name="shield-checkmark-outline"
                                                size={18}
                                                color="#168C82"
                                            />

                                            <Text className="ml-2 text-[11px] font-semibold text-[#168C82]">
                                                Verified facility
                                            </Text>
                                        </View>
                                    </View>

                                    {/* ACTIONS */}
                                    <View className="mt-6 flex-row">
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                if (!selectedCentre) {
                                                    return;
                                                }

                                                const appointmentId =
                                                    Date.now().toString();

                                                const firstService =
                                                    selectedCentre.services
                                                        .split(" · ")[0] ||
                                                    "Healthcare Service";

                                                setSelectedCentre(null);

                                                router.push({
                                                    pathname: "/bookings",
                                                    params: {
                                                        appointmentId,
                                                        facility:
                                                        selectedCentre.name,
                                                        service: firstService,
                                                        image: selectedCentre.image,
                                                        location:
                                                        selectedCentre.location,
                                                        price: selectedCentre.price,
                                                        date: "Tue, 19 Aug 2026",
                                                        time: "10:30 AM",
                                                    },
                                                });
                                            }}
                                            className="flex-1 items-center rounded-xl bg-[#168C82] py-4"
                                        >
                                            <Text className="text-[13px] font-bold text-white">
                                                Book a service
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </View>
            </Modal>

            {/* LOCATION PICKER MODAL */}
            <Modal
                visible={showLocationModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowLocationModal(false)}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View className="max-h-[70%] rounded-t-3xl bg-white px-5 pb-8 pt-5">
                        <View className="flex-row items-center justify-between pb-4">
                            <Text className="text-[18px] font-bold text-gray-900">
                                Select your state
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    setShowLocationModal(false)
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#7B8794"
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {nigerianStates.map((state) => {
                                const isSelected =
                                    location === `${state}` ||
                                    (state === "Abuja (FCT)" &&
                                        location === "Abuja, Nigeria");

                                return (
                                    <TouchableOpacity
                                        key={state}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setLocation(
                                                state === "Abuja (FCT)"
                                                    ? "Abuja, Nigeria"
                                                    : `${state}, Nigeria`
                                            );

                                            setShowLocationModal(false);
                                        }}
                                        className="flex-row items-center justify-between border-b border-gray-100 py-4"
                                    >
                                        <Text
                                            className={`text-[15px] ${
                                                isSelected
                                                    ? "font-bold text-[#168C82]"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {state}
                                        </Text>

                                        {isSelected && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={20}
                                                color="#168C82"
                                            />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Home;
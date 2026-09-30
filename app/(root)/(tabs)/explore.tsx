import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type Category = {
    title: string;
    icon?: IconName | ImageSourcePropType;
    emoji?: string;
};

type Area = {
    name: string;
    count: number;
};

type Facility = {
    id: string;
    name: string;
    location: string;
    type: string;
    rating: string;
    reviews: string;
    price: string;
    services: string[];
    image: string;
    open: boolean;
};

const categories: Category[] = [
    {
        title: "All",
        icon: "sparkles",
    },
    {
        title: "Lab",
        emoji: "🧪",
    },
    {
        title: "Radiology",
        emoji: "🩻",
    },
    {
        title: "Pharmacy",
        emoji: "💊",
    },
    {
        title: "Health Check",
        emoji: "🩺",
    },
    {
        title: "Equipment",
        emoji: "🦽",
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

const facilities: Facility[] = [
    {
        id: "1",
        name: "Echolab Radiology & Laboratory Services",
        location: "Garki",
        type: "Radiology & Laboratory",
        rating: "4.8",
        reviews: "312",
        price: "₦20,000",
        services: ["MRI", "CT", "Laboratory"],
        image:
            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600",
        open: true,
    },
    {
        id: "2",
        name: "Everight Diagnostic & Laboratory Services",
        location: "Wuse II",
        type: "Radiology & Laboratory",
        rating: "4.9",
        reviews: "428",
        price: "₦18,500",
        services: ["MRI", "CT", "X-Ray", "Ultrasound"],
        image:
            "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600",
        open: true,
    },
    {
        id: "3",
        name: "Zenith Health Laboratories",
        location: "Garki",
        type: "Laboratory",
        rating: "4.6",
        reviews: "187",
        price: "₦4,500",
        services: ["Blood Tests", "PCR"],
        image:
            "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600",
        open: true,
    },
    {
        id: "4",
        name: "H-Medix Pharmacy",
        location: "Wuse II",
        type: "Pharmacy",
        rating: "4.7",
        reviews: "264",
        price: "₦850",
        services: ["Prescription", "OTC", "Healthcare"],
        image:
            "https://images.unsplash.com/photo-1631980839324-fdfabbf1a573?w=600",
        open: true,
    },
    {
        id: "5",
        name: "Skyle Medical Tech",
        location: "Utako",
        type: "Medical Equipment",
        rating: "4.8",
        reviews: "156",
        price: "₦850",
        services: ["Medical Devices", "Equipment"],
        image:
            "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600",
        open: true,
    },
    {
        id: "6",
        name: "National Hospital Abuja",
        location: "Garki",
        type: "Health Check",
        rating: "4.8",
        reviews: "520",
        price: "₦15,000",
        services: ["Health Screening", "Check-up"],
        image:
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600",
        open: true,
    },
];

/*
|--------------------------------------------------------------------------
| BROWSE BY AREA
|--------------------------------------------------------------------------
|
| Automatically creates areas from the facilities above.
|
| Current result:
|
| Wuse II → 2
| Garki   → 3
| Utako   → 1
|
*/

const areas: Area[] = Object.values(
    facilities.reduce(
        (acc, facility) => {
            if (!acc[facility.location]) {
                acc[facility.location] = {
                    name: facility.location,
                    count: 0,
                };
            }

            acc[facility.location].count += 1;

            return acc;
        },
        {} as Record<string, Area>
    )
);

const Explore = () => {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState("All");
    const [selectedArea, setSelectedArea] =
        useState("All Areas");

    /*
    |--------------------------------------------------------------------------
    | SEARCH + FILTER FACILITIES
    |--------------------------------------------------------------------------
    |
    | Search works across:
    |
    | 1. Facility name
    | 2. Facility location
    | 3. Facility type
    | 4. Services offered
    |
    | It also supports multiple search words.
    |
    | Examples:
    |
    | MRI
    | Garki
    | Echolab
    | Blood Tests
    | MRI Garki
    | Radiology Wuse
    | Medical Equipment
    |
    */

    const filteredFacilities = facilities.filter((facility) => {
        const searchText = search.trim().toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | CREATE SEARCHABLE TEXT
        |--------------------------------------------------------------------------
        |
        | Everything about the facility that should be searchable
        | is combined into one string.
        |
        */

        const searchableText = [
            facility.name,
            facility.location,
            facility.type,
            ...facility.services,
        ]
            .join(" ")
            .toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | SEARCH WORDS
        |--------------------------------------------------------------------------
        |
        | Splits searches such as:
        |
        | "MRI Garki"
        |
        | into:
        |
        | ["mri", "garki"]
        |
        */

        const searchWords = searchText
            .split(/\s+/)
            .filter(Boolean);

        /*
        |--------------------------------------------------------------------------
        | SEARCH FILTER
        |--------------------------------------------------------------------------
        |
        | Every search word must exist somewhere in the
        | facility's searchable information.
        |
        */

        const matchesSearch =
            searchWords.length === 0 ||
            searchWords.every((word) =>
                searchableText.includes(word)
            );

        /*
        |--------------------------------------------------------------------------
        | CATEGORY FILTER
        |--------------------------------------------------------------------------
        */

        const facilityType = facility.type.toLowerCase();

        const matchesCategory =
            selectedCategory === "All" ||
            (selectedCategory === "Lab" &&
                (facilityType.includes("laboratory") ||
                    facilityType.includes("lab"))) ||
            (selectedCategory === "Radiology" &&
                facilityType.includes("radiology")) ||
            (selectedCategory === "Pharmacy" &&
                facilityType.includes("pharmacy")) ||
            (selectedCategory === "Health Check" &&
                facilityType.includes("health check")) ||
            (selectedCategory === "Equipment" &&
                facilityType.includes("equipment"));

        /*
        |--------------------------------------------------------------------------
        | AREA FILTER
        |--------------------------------------------------------------------------
        */

        const matchesArea =
            selectedArea === "All Areas" ||
            facility.location === selectedArea;

        /*
        |--------------------------------------------------------------------------
        | FINAL RESULT
        |--------------------------------------------------------------------------
        */

        return (
            matchesSearch &&
            matchesCategory &&
            matchesArea
        );
    });

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 32,
                }}
            >
                {/* HEADER */}
                <View className="px-5 pt-5">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-[34px] font-bold tracking-[-1px] text-[#17233D]">
                            Explore
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {}}
                            className="flex-row items-center rounded-2xl border-[3px] border-[#E5EBF3] px-5 py-3"
                        >
                            <Ionicons
                                name="map-outline"
                                size={22}
                                color="#34445F"
                            />

                            <Text className="ml-3 text-[16px] font-bold text-[#34445F]">
                                Map view
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* SEARCH */}
                <View className="mx-5 mt-8 flex-row items-center rounded-3xl border-[3px] border-[#E5EBF3] bg-[#F9FBFD] px-5 py-4">
                    <Ionicons
                        name="search-outline"
                        size={23}
                        color="#91A5C2"
                    />

                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search facilities, tests, drugs..."
                        placeholderTextColor="#91A5C2"
                        className="ml-3 flex-1 text-[16px] text-[#17233D]"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="search"
                    />

                    {search.length > 0 && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setSearch("")}
                        >
                            <Ionicons
                                name="close-circle"
                                size={21}
                                color="#91A5C2"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* CATEGORY FILTERS */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 14,
                        paddingTop: 18,
                    }}
                >
                    {categories.map((category) => {
                        const isSelected =
                            selectedCategory ===
                            category.title;

                        return (
                            <TouchableOpacity
                                key={category.title}
                                activeOpacity={0.8}
                                onPress={() =>
                                    setSelectedCategory(
                                        category.title
                                    )
                                }
                                className={`mr-3 flex-row items-center rounded-full border-[3px] px-5 py-3 ${
                                    isSelected
                                        ? "border-[#079B8F] bg-[#079B8F]"
                                        : "border-[#E5EBF3] bg-white"
                                }`}
                            >
                                {/* ICON */}
                                <View className="h-10 w-10 items-center justify-center">
                                    {category.emoji ? (
                                        <Text className="text-2xl">
                                            {category.emoji}
                                        </Text>
                                    ) : typeof category.icon ===
                                    "string" ? (
                                        <Ionicons
                                            name={
                                                category.icon as IconName
                                            }
                                            size={20}
                                            color={
                                                isSelected
                                                    ? "#FFFFFF"
                                                    : "#52637D"
                                            }
                                        />
                                    ) : (
                                        <Image
                                            source={
                                                category.icon as ImageSourcePropType
                                            }
                                            resizeMode="contain"
                                            style={{
                                                width: 22,
                                                height: 22,
                                            }}
                                        />
                                    )}
                                </View>

                                <Text
                                    className={`ml-2 text-[16px] font-semibold ${
                                        isSelected
                                            ? "text-white"
                                            : "text-[#52637D]"
                                    }`}
                                >
                                    {category.title}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* SPECIAL OFFERS HEADER */}
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

                {/* SPECIAL OFFERS */}
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
                                backgroundColor:
                                offer.background,
                                borderColor: offer.border,
                            }}
                            className="mr-5 h-[200px] w-[400px] rounded-[28px] border-[3px] p-7"
                        >
                            <View className="flex-row items-center">
                                <View
                                    style={{
                                        backgroundColor:
                                        offer.iconColor,
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
                                    style={{
                                        color: offer.iconColor,
                                    }}
                                    className="ml-3 text-[17px] font-bold tracking-[1.5px]"
                                >
                                    OFFER
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
                                        backgroundColor:
                                        offer.iconColor,
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

                {/* BROWSE BY AREA */}
                <View className="mt-7">
                    <Text className="px-5 text-[18px] font-bold tracking-[1.5px] text-[#627692]">
                        BROWSE BY AREA · ABUJA
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 19,
                            paddingTop: 25,
                        }}
                    >
                        {areas.map((area) => {
                            const isSelected =
                                selectedArea === area.name;

                            return (
                                <TouchableOpacity
                                    key={area.name}
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        setSelectedArea(
                                            isSelected
                                                ? "All Areas"
                                                : area.name
                                        )
                                    }
                                    className={`mr-4 flex-row items-center rounded-2xl border-[3px] px-6 py-4 ${
                                        isSelected
                                            ? "border-[#8BF0E2] bg-[#F4FFFD]"
                                            : "border-[#E5EBF3] bg-white"
                                    }`}
                                >
                                    <Text
                                        className={`text-[17px] font-bold ${
                                            isSelected
                                                ? "text-[#078F84]"
                                                : "text-[#34445F]"
                                        }`}
                                    >
                                        {area.name}
                                    </Text>

                                    <View className="ml-3 rounded-full bg-[#F0F4F9] px-3 py-1.5">
                                        <Text className="text-[14px] font-bold text-[#91A5C2]">
                                            {area.count}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* TOP-RATED HEADER */}
                <View className="mt-7 flex-row items-center justify-between px-5">
                    <Text className="text-[20px] font-bold text-[#627692]">
                        Top-rated near you
                    </Text>

                    <TouchableOpacity>
                        <Text className="text-[18px] font-bold text-[#079B8F]">
                            See all
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* FACILITY CARDS */}
                <View className="mt-5 px-5">
                    {filteredFacilities.length === 0 ? (
                        <View className="items-center rounded-2xl bg-[#F7FAFC] px-5 py-10">
                            <Ionicons
                                name="search-outline"
                                size={35}
                                color="#91A5C2"
                            />

                            <Text className="mt-3 text-center text-[15px] text-[#627692]">
                                No healthcare facilities found.
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    setSearch("");
                                    setSelectedCategory("All");
                                    setSelectedArea(
                                        "All Areas"
                                    );
                                }}
                                className="mt-4 rounded-xl bg-[#079B8F] px-5 py-3"
                            >
                                <Text className="font-bold text-white">
                                    Clear filters
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        filteredFacilities.map(
                            (facility) => (
                                <TouchableOpacity
                                    key={facility.id}
                                    activeOpacity={0.85}
                                    onPress={() => {}}
                                    className="mb-5 flex-row overflow-hidden rounded-[28px] bg-white"
                                    style={{
                                        minHeight: 190,
                                        shadowColor:
                                            "#9AA8BA",
                                        shadowOffset: {
                                            width: 0,
                                            height: 3,
                                        },
                                        shadowOpacity: 0.16,
                                        shadowRadius: 7,
                                        elevation: 3,
                                    }}
                                >
                                    {/* FACILITY IMAGE */}
                                    <View className="w-[36%]">
                                        <Image
                                            source={{
                                                uri: facility.image,
                                            }}
                                            resizeMode="cover"
                                            className="h-[200px] w-full"
                                        />

                                        {facility.open && (
                                            <View className="absolute bottom-3 left-3 rounded-full bg-[#0ACB52] px-3 py-1.5">
                                                <Text className="text-[11px] font-bold text-white">
                                                    ● Open
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* FACILITY DETAILS */}
                                    <View className="flex-1 p-4">
                                        <View className="flex-row items-start justify-between">
                                            <Text
                                                numberOfLines={2}
                                                className="mr-2 flex-1 text-[16px] font-bold leading-6 text-[#17233D]"
                                            >
                                                {
                                                    facility.name
                                                }
                                            </Text>

                                            <Ionicons
                                                name="checkmark-circle"
                                                size={22}
                                                color="#079B8F"
                                            />
                                        </View>

                                        <Text className="mt-1 text-[14px] text-[#657C9D]">
                                            {
                                                facility.location
                                            }{" "}
                                            ·{" "}
                                            {
                                                facility.type
                                            }
                                        </Text>

                                        <View className="mt-4 flex-row items-center">
                                            <Ionicons
                                                name="star"
                                                size={16}
                                                color="#F59E0B"
                                            />

                                            <Text className="ml-1 text-[14px] font-bold text-[#17233D]">
                                                {
                                                    facility.rating
                                                }
                                            </Text>

                                            <Text className="ml-1 text-[13px] text-[#91A5C2]">
                                                (
                                                {
                                                    facility.reviews
                                                }
                                                )
                                            </Text>

                                            <Text className="ml-3 text-[14px] font-bold text-[#078F84]">
                                                from{" "}
                                                {
                                                    facility.price
                                                }
                                            </Text>
                                        </View>

                                        <View className="mt-4 flex-row items-center">
                                            {facility.services.map(
                                                (
                                                    service
                                                ) => (
                                                    <View
                                                        key={
                                                            service
                                                        }
                                                        className="mr-2 rounded-full bg-[#F0F4F9] px-3 py-2"
                                                    >
                                                        <Text className="text-[12px] text-[#52637D]">
                                                            {
                                                                service
                                                            }
                                                        </Text>
                                                    </View>
                                                )
                                            )}
                                        </View>

                                        <View className="mt-3 items-end">
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {}}
                                                className="rounded-2xl bg-[#079B8F] px-5 py-3"
                                            >
                                                <Text className="text-[15px] font-bold text-white">
                                                    View
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        )
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Explore;
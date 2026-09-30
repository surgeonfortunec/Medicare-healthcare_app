import React, { useState } from "react";
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type TabType =
    | "Overview"
    | "Lab Results"
    | "Radiology"
    | "Records"
    | "Access Log";

const Records = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("Overview");

    const tabs: {
        name: TabType;
        icon: keyof typeof Ionicons.glyphMap;
    }[] = [
        {
            name: "Overview",
            icon: "home-outline",
        },
        {
            name: "Lab Results",
            icon: "flask-outline",
        },
        {
            name: "Radiology",
            icon: "scan-outline",
        },
        {
            name: "Records",
            icon: "document-text-outline",
        },
        {
            name: "Access Log",
            icon: "lock-closed-outline",
        },
    ];

    const handleRevokeAll = () => {
        Alert.alert(
            "Revoke all active access?",
            "This will immediately remove access for everyone currently authorised to view your records.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Revoke",
                    style: "destructive",
                    onPress: () => {
                        // TODO: call API to revoke all active access grants
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="light-content" />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 110,
                }}
            >
                {/* ============================= */}
                {/* HERO SECTION */}
                {/* ============================= */}

                <View
                    className="bg-[#142137] px-6 pt-12 pb-8"
                    style={{
                        overflow: "hidden",
                    }}
                >
                    {/* Decorative circles */}
                    <View
                        className="absolute bg-[#293850] rounded-full"
                        style={{
                            width: 340,
                            height: 340,
                            right: -70,
                            top: -130,
                            opacity: 0.65,
                        }}
                    />

                    <View
                        className="absolute bg-[#087F83] rounded-full"
                        style={{
                            width: 210,
                            height: 210,
                            right: -10,
                            bottom: -90,
                            opacity: 0.25,
                        }}
                    />

                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-7">
                        <View>
                            <Text
                                className="text-white text-4xl font-rubik-bold"
                                style={{
                                    fontFamily: "serif",
                                }}
                            >
                                Health Records
                            </Text>
                        </View>

                        <View
                            className="w-20 h-20 rounded-2xl items-center justify-center"
                            style={{
                                backgroundColor: "#153D4B",
                                borderWidth: 3,
                                borderColor: "#008F8B",
                            }}
                        >
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={38}
                                color="#16D4C7"
                            />
                        </View>
                    </View>

                    {/* Statistics */}
                    <View className="flex-row justify-between">
                        <StatCard
                            number="13"
                            label="Total records"
                            numberColor="#21D0C3"
                        />

                        <StatCard
                            number="1"
                            label="Awaiting results"
                            numberColor="#FFC629"
                        />

                        <StatCard
                            number="2"
                            label="Access events"
                            numberColor="#8585FF"
                        />
                    </View>

                    {/* Security banner */}
                    <View className="mt-7 bg-[#2C3A50] rounded-2xl px-5 py-4 flex-row items-center">
                        <Ionicons
                            name="lock-closed-outline"
                            size={23}
                            color="#19D3C5"
                        />

                        <Text className="ml-4 text-[#D1D8E4] text-lg font-rubik-medium">
                            End-to-end encrypted ·{" "}
                            <Text className="text-[#20D4C6] font-rubik-bold">
                                Patient-controlled
                            </Text>
                        </Text>

                        <View className="ml-auto flex-row items-center">
                            <View className="w-3 h-3 rounded-full bg-[#16C8BB] mr-2" />

                            <Text className="text-[#16C8BB] text-base font-rubik-bold">
                                Secure
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ============================= */}
                {/* CATEGORY TABS */}
                {/* ============================= */}

                <View className="px-5 py-6">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            gap: 10,
                        }}
                    >
                        {tabs.map((tab) => {
                            const active = activeTab === tab.name;

                            return (
                                <TouchableOpacity
                                    key={tab.name}
                                    activeOpacity={0.8}
                                    onPress={() => setActiveTab(tab.name)}
                                    className={`flex-row items-center px-5 py-4 rounded-2xl ${
                                        active
                                            ? "bg-[#009F91]"
                                            : "bg-[#F1F5F9]"
                                    }`}
                                >
                                    <Ionicons
                                        name={tab.icon}
                                        size={21}
                                        color={
                                            active
                                                ? "#FFFFFF"
                                                : "#536681"
                                        }
                                    />

                                    <Text
                                        className={`ml-2 text-base font-rubik-bold ${
                                            active
                                                ? "text-white"
                                                : "text-[#536681]"
                                        }`}
                                    >
                                        {tab.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* ============================= */}
                    {/* OVERVIEW */}
                    {/* ============================= */}

                    {activeTab === "Overview" && (
                        <>
                            {/* Record summary cards */}
                            <View className="flex-row justify-between mt-1">
                                <RecordCard
                                    icon="🧬"
                                    number="4"
                                    title="Lab Results"
                                    background="#DDEBFF"
                                    numberColor="#285ED8"
                                />

                                <RecordCard
                                    icon="🩻"
                                    number="2"
                                    title="Radiology"
                                    background="#C9F8EF"
                                    numberColor="#009B8F"
                                />
                            </View>

                            <View className="flex-row justify-between mt-5">
                                <RecordCard
                                    icon="📋"
                                    number="7"
                                    title="Medical Records"
                                    background="#F0E2FF"
                                    numberColor="#7540E8"
                                />

                                <RecordCard
                                    icon="🔐"
                                    number="2"
                                    title="Access Log"
                                    background="#FFF2C5"
                                    numberColor="#D77B00"
                                />
                            </View>

                            {/* ============================= */}
                            {/* RESULTS NEEDING ATTENTION */}
                            {/* ============================= */}

                            <View className="mt-7 bg-[#FFF3F3] border-2 border-[#FFDADA] rounded-3xl p-7">
                                <View className="flex-row items-center mb-7">
                                    <View className="w-7 h-7 rounded-full border-2 border-[#E52D2D] items-center justify-center">
                                        <Text className="text-[#E52D2D] font-rubik-bold">
                                            !
                                        </Text>
                                    </View>

                                    <Text className="ml-4 text-[#D82020] text-xl font-rubik-bold">
                                        Results needing attention
                                    </Text>
                                </View>

                                <AttentionRow
                                    title="Full Blood Count + Lipid Profile"
                                />

                                <AttentionRow title="MRI – Brain & Spine" />
                            </View>

                            {/* ============================= */}
                            {/* AWAITING RESULTS */}
                            {/* ============================= */}

                            <View className="mt-6 bg-[#FFFBEA] border-2 border-[#FFEBA7] rounded-3xl p-7">
                                <View className="flex-row items-center mb-8">
                                    <Ionicons
                                        name="time-outline"
                                        size={25}
                                        color="#CC6800"
                                    />

                                    <Text className="ml-4 text-[#C65E00] text-xl font-rubik-bold">
                                        Awaiting results (1)
                                    </Text>
                                </View>

                                <Text className="text-[#17243B] text-lg font-rubik-bold">
                                    Abdominal Ultrasound
                                </Text>

                                <View className="flex-row items-center justify-between mt-1">
                                    <Text className="text-[#667B9B] text-base font-rubik">
                                        Echolab Radiology & Laboratory Services
                                    </Text>

                                    <View className="bg-[#FFF0C2] px-4 py-2 rounded-full">
                                        <Text className="text-[#E77A00] font-rubik-bold">
                                            Processing
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </>
                    )}

                    {/* ============================= */}
                    {/* LAB RESULTS */}
                    {/* ============================= */}

                    {activeTab === "Lab Results" && (
                        <View className="mt-5">
                            <SectionTitle
                                title="Laboratory Results"
                                subtitle="Your available laboratory test results"
                            />

                            <ResultItem
                                icon="🧬"
                                title="Full Blood Count"
                                facility="Zenith Health Laboratories"
                                date="06 Aug 2026"
                                status="Ready"
                                statusColor="#0A9B4A"
                                background="#EAFBF1"
                            />

                            <ResultItem
                                icon="🧪"
                                title="Lipid Profile"
                                facility="Zenith Health Laboratories"
                                date="06 Aug 2026"
                                status="Ready"
                                statusColor="#0A9B4A"
                                background="#EAFBF1"
                            />

                            <ResultItem
                                icon="🧬"
                                title="Malaria Test"
                                facility="Echolab Radiology & Laboratory Services"
                                date="19 Aug 2026"
                                status="Ready"
                                statusColor="#0A9B4A"
                                background="#EAFBF1"
                            />

                            <ResultItem
                                icon="🩸"
                                title="Blood Chemistry"
                                facility="Echolab Radiology & Laboratory Services"
                                date="19 Aug 2026"
                                status="Processing"
                                statusColor="#D47700"
                                background="#FFF4D7"
                            />
                        </View>
                    )}

                    {/* ============================= */}
                    {/* RADIOLOGY */}
                    {/* ============================= */}

                    {activeTab === "Radiology" && (
                        <View className="mt-5">
                            <SectionTitle
                                title="Radiology Results"
                                subtitle="Imaging studies and reports"
                            />

                            <ResultItem
                                icon="🩻"
                                title="MRI – Brain & Spine"
                                facility="Everight Diagnostic & Laboratory Services"
                                date="25 Aug 2026"
                                status="Ready"
                                statusColor="#0A9B4A"
                                background="#EAFBF1"
                            />

                            <ResultItem
                                icon="🩻"
                                title="Abdominal Ultrasound"
                                facility="Echolab Radiology & Laboratory Services"
                                date="19 Aug 2026"
                                status="Processing"
                                statusColor="#D47700"
                                background="#FFF4D7"
                            />

                            <ResultItem
                                icon="🩻"
                                title="Executive Health Check Imaging"
                                facility="National Hospital Abuja"
                                date="29 Aug 2026"
                                status="Ready"
                                statusColor="#0A9B4A"
                                background="#EAFBF1"
                            />
                        </View>
                    )}

                    {/* ============================= */}
                    {/* MEDICAL RECORDS */}
                    {/* ============================= */}

                    {activeTab === "Records" && (
                        <View className="mt-5">
                            <SectionTitle
                                title="Medical Records"
                                subtitle="Your personal medical documents"
                            />

                            <ResultItem
                                icon="📋"
                                title="Medical History"
                                facility="Medicare Records"
                                date="20 Aug 2026"
                                status="Available"
                                statusColor="#009B8F"
                                background="#E6FAF7"
                            />

                            <ResultItem
                                icon="📄"
                                title="Doctor's Report"
                                facility="Echolab Radiology & Laboratory Services"
                                date="19 Aug 2026"
                                status="Available"
                                statusColor="#009B8F"
                                background="#E6FAF7"
                            />

                            <ResultItem
                                icon="💊"
                                title="Prescription Record"
                                facility="H-Medix Pharmacy"
                                date="15 Aug 2026"
                                status="Available"
                                statusColor="#009B8F"
                                background="#E6FAF7"
                            />

                            <ResultItem
                                icon="📋"
                                title="Executive Health Check Report"
                                facility="National Hospital Abuja"
                                date="29 Aug 2026"
                                status="Available"
                                statusColor="#009B8F"
                                background="#E6FAF7"
                            />

                            <ResultItem
                                icon="🦽"
                                title="Medical Equipment Report"
                                facility="Skyle Medical Tech"
                                date="14 Aug 2026"
                                status="Available"
                                statusColor="#009B8F"
                                background="#E6FAF7"
                            />
                        </View>
                    )}

                    {/* ============================= */}
                    {/* ACCESS LOG */}
                    {/* ============================= */}

                    {activeTab === "Access Log" && (
                        <View className="mt-5">
                            {/* Info banner */}
                            <View className="bg-[#E7E9FE] rounded-3xl px-6 py-5 flex-row items-start mb-6">
                                <Ionicons
                                    name="shield-outline"
                                    size={22}
                                    color="#5B4FE5"
                                    style={{ marginTop: 2 }}
                                />

                                <Text className="ml-4 flex-1 text-[#4A3FD1] text-base font-rubik-medium leading-6">
                                    Only people you've explicitly granted access
                                    can view your records. All access is logged
                                    here.
                                </Text>
                            </View>

                            {/* Recent access events card */}
                            <View
                                className="bg-white rounded-3xl"
                                style={{
                                    borderWidth: 2,
                                    borderColor: "#EDF1F5",
                                    shadowColor: "#64748B",
                                    shadowOpacity: 0.1,
                                    shadowRadius: 5,
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    elevation: 2,
                                }}
                            >
                                <Text className="text-[#17243B] text-xl font-rubik-bold px-6 pt-6 pb-4">
                                    Recent access events
                                </Text>

                                <View className="h-[1.5px] bg-[#EDF1F5]" />

                                <AccessLogRow
                                    initial="C"
                                    avatarColor="#5B4FE5"
                                    name="Dr. Chukwuemeka Okafor"
                                    role="Radiologist · Echolab Radiology & Laboratory Services"
                                    viewedLabel="MRI Report"
                                    date="19 Aug 2026"
                                    status="Authorised"
                                    isLast={false}
                                />

                                <AccessLogRow
                                    initial="A"
                                    avatarColor="#5B4FE5"
                                    name="Dr. Amina Bello"
                                    role="General Practitioner · National Hospital Abuja"
                                    viewedLabel="Full Blood Count"
                                    date="14 Jul 2026"
                                    status="Authorised"
                                    isLast={true}
                                />
                            </View>

                            {/* Revoke all button */}
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={handleRevokeAll}
                                className="mt-6 bg-[#FFEDED] border-2 border-[#FFD4D4] rounded-2xl py-5 items-center"
                            >
                                <Text className="text-[#E52D2D] text-lg font-rubik-bold">
                                    Revoke all active access
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

/* ===================================================== */
/* STAT CARD */
/* ===================================================== */

const StatCard = ({
                      number,
                      label,
                      numberColor,
                  }: {
    number: string;
    label: string;
    numberColor: string;
}) => {
    return (
        <View
            className="rounded-2xl items-center justify-center"
            style={{
                backgroundColor: "#2B3850",
                width: "31.5%",
                height: 105,
            }}
        >
            <Text
                className="text-3xl font-rubik-bold"
                style={{ color: numberColor }}
            >
                {number}
            </Text>

            <Text className="text-[#9CAAC0] text-sm font-rubik-medium mt-1">
                {label}
            </Text>
        </View>
    );
};

/* ===================================================== */
/* RECORD CARD */
/* ===================================================== */

const RecordCard = ({
                        icon,
                        number,
                        title,
                        background,
                        numberColor,
                    }: {
    icon: string;
    number: string;
    title: string;
    background: string;
    numberColor: string;
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            className="rounded-3xl p-7"
            style={{
                width: "48%",
                height: 220,
                backgroundColor: background,
                borderWidth: 2,
                borderColor: "#E7EDF4",
                shadowColor: "#64748B",
                shadowOpacity: 0.12,
                shadowRadius: 5,
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                elevation: 3,
            }}
        >
            <Text className="text-4xl">{icon}</Text>

            <Text
                className="text-4xl font-rubik-bold mt-5"
                style={{ color: numberColor }}
            >
                {number}
            </Text>

            <Text className="text-[#30415D] text-lg font-rubik-bold mt-2">
                {title}
            </Text>
        </TouchableOpacity>
    );
};

/* ===================================================== */
/* ATTENTION ROW */
/* ===================================================== */

const AttentionRow = ({ title }: { title: string }) => {
    return (
        <View className="flex-row items-center justify-between mb-7">
            <Text
                className="text-[#34445F] text-lg font-rubik-medium"
                style={{
                    flex: 1,
                    marginRight: 15,
                }}
            >
                {title}
            </Text>

            <TouchableOpacity
                activeOpacity={0.8}
                className="px-5 py-3 rounded-xl bg-white"
                style={{
                    borderWidth: 2,
                    borderColor: "#BDF1E9",
                }}
            >
                <Text className="text-[#009B8F] text-base font-rubik-bold">
                    View
                </Text>
            </TouchableOpacity>
        </View>
    );
};

/* ===================================================== */
/* SECTION TITLE */
/* ===================================================== */

const SectionTitle = ({
                          title,
                          subtitle,
                      }: {
    title: string;
    subtitle: string;
}) => {
    return (
        <View className="mb-5">
            <Text className="text-[#17243B] text-2xl font-rubik-bold">
                {title}
            </Text>

            <Text className="text-[#71839F] text-base font-rubik mt-1">
                {subtitle}
            </Text>
        </View>
    );
};

/* ===================================================== */
/* RESULT ITEM */
/* ===================================================== */

const ResultItem = ({
                        icon,
                        title,
                        facility,
                        date,
                        status,
                        statusColor,
                        background,
                    }: {
    icon: string;
    title: string;
    facility: string;
    date: string;
    status: string;
    statusColor: string;
    background: string;
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            className="bg-white rounded-3xl p-5 mb-4 flex-row items-center"
            style={{
                borderWidth: 2,
                borderColor: "#EDF1F5",
                shadowColor: "#64748B",
                shadowOpacity: 0.1,
                shadowRadius: 5,
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                elevation: 2,
            }}
        >
            <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{
                    backgroundColor: background,
                }}
            >
                <Text className="text-3xl">{icon}</Text>
            </View>

            <View className="flex-1 ml-4">
                <Text className="text-[#1C2940] text-lg font-rubik-bold">
                    {title}
                </Text>

                <Text className="text-[#7285A1] text-sm font-rubik mt-1">
                    {facility}
                </Text>

                <Text className="text-[#8A9AB1] text-sm font-rubik mt-1">
                    {date}
                </Text>
            </View>

            <View
                className="px-3 py-2 rounded-full"
                style={{
                    backgroundColor: background,
                }}
            >
                <Text
                    className="text-xs font-rubik-bold"
                    style={{
                        color: statusColor,
                    }}
                >
                    {status}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

/* ===================================================== */
/* ACCESS LOG ROW */
/* ===================================================== */

const AccessLogRow = ({
                          initial,
                          avatarColor,
                          name,
                          role,
                          viewedLabel,
                          date,
                          status,
                          isLast,
                      }: {
    initial: string;
    avatarColor: string;
    name: string;
    role: string;
    viewedLabel: string;
    date: string;
    status: string;
    isLast: boolean;
}) => {
    return (
        <View
            className="flex-row items-start px-6 py-6"
            style={{
                borderBottomWidth: isLast ? 0 : 1.5,
                borderBottomColor: "#EDF1F5",
            }}
        >
            {/* Avatar */}
            <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: avatarColor }}
            >
                <Text className="text-white text-lg font-rubik-bold">
                    {initial}
                </Text>
            </View>

            {/* Details */}
            <View className="flex-1">
                <Text className="text-[#17243B] text-lg font-rubik-bold">
                    {name}
                </Text>

                <Text className="text-[#71839F] text-base font-rubik mt-1">
                    {role}
                </Text>

                <Text className="text-[#8A9AB1] text-sm font-rubik mt-2">
                    Viewed:{" "}
                    <Text className="text-[#34445F] font-rubik-bold">
                        {viewedLabel}
                    </Text>{" "}
                    · {date}
                </Text>
            </View>

            {/* Status badge */}
            <View className="bg-[#E4F9EC] px-4 py-2 rounded-full ml-2">
                <Text className="text-[#0A9B4A] text-sm font-rubik-bold">
                    {status}
                </Text>
            </View>
        </View>
    );
};

export default Records;
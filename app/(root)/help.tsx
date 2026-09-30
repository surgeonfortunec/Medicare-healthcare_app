import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type ContactOption = {
    id: string;
    icon: string;
    iconLibrary: "ionicon" | "emoji" | "dot";
    title: string;
    subtitle: string;
    badge?: string;
    background: string;
};

type IssueItem = {
    id: string;
    icon: string;
    title: string;
    tag: string;
};

type TicketItem = {
    id: string;
    title: string;
    reference: string;
    date: string;
    status: string;
};

const contactOptions: ContactOption[] = [
    {
        id: "live-chat",
        icon: "chatbubble-ellipses",
        iconLibrary: "ionicon",
        title: "Live Chat",
        subtitle: "Avg. reply in 3 mins",
        badge: "Online",
        background: "#F0FBF8",
    },
    {
        id: "call-support",
        icon: "call",
        iconLibrary: "ionicon",
        title: "Call Support",
        subtitle: "+234 800 HEALTH (43258)",
        background: "#F5F7FA",
    },
    {
        id: "whatsapp",
        icon: "●",
        iconLibrary: "dot",
        title: "WhatsApp",
        subtitle: "+234 803 000 0000",
        background: "#F5FBF5",
    },
    {
        id: "submit-ticket",
        icon: "mail",
        iconLibrary: "ionicon",
        title: "Submit a Ticket",
        subtitle: "Response within 24 hrs",
        background: "#FBF7FA",
    },
];

const commonIssues: IssueItem[] = [
    {
        id: "1",
        icon: "🧪",
        title: "Result not received",
        tag: "Results",
    },
    {
        id: "2",
        icon: "📅",
        title: "Reschedule appointment",
        tag: "Booking",
    },
    {
        id: "3",
        icon: "💳",
        title: "Payment issue",
        tag: "Billing",
    },
    {
        id: "4",
        icon: "🏥",
        title: "Facility complaint",
        tag: "Facilities",
    },
    {
        id: "5",
        icon: "🔐",
        title: "Account & privacy",
        tag: "Account",
    },
    {
        id: "6",
        icon: "📊",
        title: "Understanding my report",
        tag: "Results",
    },
];

const recentTickets: TicketItem[] = [
    {
        id: "1",
        title: "MRI report not received",
        reference: "#HP-20260801-3310",
        date: "1 Aug 2026",
        status: "Resolved",
    },
    {
        id: "2",
        title: "Payment charged twice",
        reference: "#HP-20260712-2198",
        date: "12 Jul 2026",
        status: "Resolved",
    },
];

const HelpCentre = () => {
    const router = useRouter();

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 110 }}
            >
                {/* ================= HERO ================= */}
                <LinearGradient
                    colors={["#0F5C52", "#12A98E"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ overflow: "hidden" }}
                    className="px-6 pt-4 pb-8"
                >
                    {/* Decorative circles */}
                    <View
                        className="absolute rounded-full bg-white"
                        style={{
                            width: 260,
                            height: 260,
                            right: -60,
                            top: -40,
                            opacity: 0.08,
                        }}
                    />
                    <View
                        className="absolute rounded-full bg-white"
                        style={{
                            width: 180,
                            height: 180,
                            right: 0,
                            bottom: -40,
                            opacity: 0.06,
                        }}
                    />

                    {/* Top bar */}
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.back()}
                            className="h-11 w-11 items-center justify-center rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                        >
                            <Ionicons name="chevron-back" size={22} color="white" />
                        </TouchableOpacity>

                        <View
                            className="rounded-full px-5 py-2.5"
                            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                        >
                            <Text className="text-[15px] font-bold text-white">
                                Help Centre
                            </Text>
                        </View>

                        <View className="h-11 w-11" />
                    </View>

                    {/* Title */}
                    <Text
                        style={{ fontFamily: "serif" }}
                        className="mt-7 text-[30px] font-bold leading-tight text-white"
                    >
                        How can we help you?
                    </Text>

                    <Text className="mt-3 text-[16px] leading-6 text-[#DCF3EE]">
                        Our support team is online and ready to assist you with
                        anything.
                    </Text>

                    {/* Live agents banner */}
                    <View
                        className="mt-6 flex-row items-center justify-between overflow-hidden rounded-[22px] px-5 py-5"
                        style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                    >
                        <View className="flex-row items-center flex-1">
                            <View
                                className="h-11 w-11 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.18)",
                                }}
                            >
                                <Ionicons
                                    name="chatbox-ellipses"
                                    size={20}
                                    color="white"
                                />
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="text-[16px] font-bold text-white">
                                    Live agents are online
                                </Text>
                                <Text className="mt-1 text-[14px] text-[#DCF3EE]">
                                    Monday – Saturday · 7 AM – 10 PM
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="mr-2 h-2.5 w-2.5 rounded-full bg-[#4ADE80]" />
                            <Text className="text-[14px] font-bold text-[#4ADE80]">
                                Online
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* ================= CONTACT US ================= */}
                <View className="px-5 pt-7">
                    <Text className="text-[14px] font-bold tracking-[1.5px] text-[#9CA3AF]">
                        CONTACT US
                    </Text>

                    <View className="mt-4 flex-row flex-wrap justify-between">
                        {contactOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                activeOpacity={0.85}
                                onPress={() => {}}
                                style={{
                                    width: "48%",
                                    backgroundColor: option.background,
                                    borderWidth: 1.5,
                                    borderColor: "#EDF1F5",
                                }}
                                className="mb-4 rounded-[22px] px-5 py-5"
                            >
                                <View className="flex-row items-center justify-between">
                                    {option.iconLibrary === "dot" ? (
                                        <View className="h-9 w-9 items-center justify-center rounded-full bg-[#22C55E]" />
                                    ) : (
                                        <Ionicons
                                            name={option.icon as any}
                                            size={26}
                                            color="#374151"
                                        />
                                    )}

                                    {option.badge && (
                                        <View className="rounded-full bg-[#DCFCE7] px-3 py-1.5">
                                            <Text className="text-[12px] font-bold text-[#16A34A]">
                                                {option.badge}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <Text className="mt-5 text-[17px] font-bold text-[#111A31]">
                                    {option.title}
                                </Text>

                                <Text className="mt-1 text-[13px] text-[#687D9D]">
                                    {option.subtitle}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ================= BROWSE FAQS ================= */}
                <View className="px-5">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {}}
                        className="flex-row items-center rounded-[22px] border-[1.5px] border-[#EDF1F5] px-5 py-5"
                    >
                        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF0FE]">
                            <Ionicons
                                name="help-circle-outline"
                                size={24}
                                color="#5B4FE5"
                            />
                        </View>

                        <View className="ml-4 flex-1">
                            <Text className="text-[17px] font-bold text-[#111A31]">
                                Browse FAQs
                            </Text>
                            <Text className="mt-1 text-[13px] text-[#687D9D]">
                                8 questions · instant answers
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#C1CBDA"
                        />
                    </TouchableOpacity>
                </View>

                {/* ================= COMMON ISSUES ================= */}
                <View className="px-5 pt-7">
                    <Text className="text-[14px] font-bold tracking-[1.5px] text-[#9CA3AF]">
                        COMMON ISSUES
                    </Text>

                    <View className="mt-4">
                        {commonIssues.map((issue) => (
                            <TouchableOpacity
                                key={issue.id}
                                activeOpacity={0.8}
                                onPress={() => {}}
                                className="mb-4 flex-row items-center rounded-[22px] border-[1.5px] border-[#EDF1F5] px-5 py-5"
                            >
                                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F7FB]">
                                    <Text className="text-[20px]">
                                        {issue.icon}
                                    </Text>
                                </View>

                                <Text className="ml-4 flex-1 text-[17px] font-bold text-[#111A31]">
                                    {issue.title}
                                </Text>

                                <View className="mr-3 rounded-full border-[1.5px] border-[#B5EDDD] bg-[#EAFBF5] px-4 py-2">
                                    <Text className="text-[13px] font-bold text-[#0F9B7F]">
                                        {issue.tag}
                                    </Text>
                                </View>

                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#C1CBDA"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ================= RECENT TICKETS ================= */}
                <View className="px-5 py-5">
                    <Text className="text-[14px] font-bold tracking-[1.5px] text-[#9CA3AF]">
                        YOUR RECENT TICKETS
                    </Text>

                    <View className="mt-4 overflow-hidden rounded-[22px] border-[1.5px] border-[#EDF1F5]">
                        {recentTickets.map((ticket) => (
                            <View
                                key={ticket.id}
                                className="flex-row items-center justify-between border-b border-[#EDF1F5] px-5 py-5"
                            >
                                <View className="flex-1">
                                    <Text className="text-[16px] font-bold text-[#111A31]">
                                        {ticket.title}
                                    </Text>
                                    <Text className="mt-1 text-[13px] text-[#9CA3AF]">
                                        {ticket.reference} · {ticket.date}
                                    </Text>
                                </View>

                                <View className="rounded-full bg-[#DCFCE7] px-4 py-2">
                                    <Text className="text-[13px] font-bold text-[#16A34A]">
                                        {ticket.status}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {}}
                            className="flex-row items-center justify-center py-5"
                        >
                            <Text className="text-[16px] font-bold text-[#0F9B7F]">
                                Open new ticket
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color="#0F9B7F"
                                style={{ marginLeft: 4 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ================= MEDICAL EMERGENCY BANNER ================= */}
                <View className="px-5 pt-7">
                    <View className="flex-row items-start rounded-[22px] border-[1.5px] border-[#FFD9D9] bg-[#FFF3F3] px-5 py-5">
                        <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#FFE2E2]">
                            <Ionicons
                                name="flash"
                                size={20}
                                color="#DC2626"
                            />
                        </View>

                        <View className="ml-4 flex-1">
                            <Text className="text-[16px] font-bold text-[#DC2626]">
                                Medical emergency?
                            </Text>
                            <Text className="mt-1 text-[14px] leading-5 text-[#E05252]">
                                Please do not use this helpdesk for medical
                                emergencies. Call{" "}
                                <Text className="font-bold text-[#DC2626]">
                                    112
                                </Text>{" "}
                                or go to your nearest emergency room
                                immediately.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HelpCentre;
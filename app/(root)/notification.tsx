import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Pressable,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WALLET_TRANSACTIONS_KEY = "medicare_wallet_transactions";
const APPOINTMENTS_KEY = "medicare_appointments";

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    time: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    iconBackground: string;
    cardBackground: string;
    borderColor: string;
    unread: boolean;
    createdAt: number;
};

type WalletTransaction = {
    id: string;
    type: "deposit" | "payment" | "withdrawal";
    amount: number;
    paymentMethod?: string;
    service?: string;
    facility?: string;
    bank?: string;
    accountLastFour?: string;
    accountName?: string;
    status?: string;
    date: string;
    appointmentDate?: string;
    appointmentTime?: string;
};

type Appointment = {
    id: string;
    facility: string;
    service: string;
    date: string;
    time: string;
    status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
    image?: string;
    location?: string;
    price?: string;
    type?: "Upcoming" | "Past";
    createdAt?: string;
    updatedAt?: string;
};

const STATIC_NOTIFICATIONS: NotificationItem[] = [
    {
        id: "result-1",
        title: "Your results are ready",
        message:
            "Full Blood Count from Zenith Health Laboratories is available to view.",
        time: "2 min ago",
        icon: "flask",
        iconColor: "#16A34A",
        iconBackground: "#F0FDF4",
        cardBackground: "#F0FDF4",
        borderColor: "#B7F5D0",
        unread: true,
        createdAt: Date.now() - 2 * 60 * 1000,
    },
    {
        id: "offer-1",
        title: "Limited offer: 20% off scans",
        message:
            "Book any radiology scan this week and save 20% at Apex Scan & Lab Centre.",
        time: "3 hrs ago",
        icon: "gift",
        iconColor: "#CA8A04",
        iconBackground: "#FFFBEB",
        cardBackground: "#FFFFFF",
        borderColor: "#E9EFF5",
        unread: false,
        createdAt: Date.now() - 3 * 60 * 60 * 1000,
    },
];

const formatCurrency = (amount: number) => {
    return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
};

const getRelativeTime = (dateString?: string, fallback?: number) => {
    const timestamp = dateString
        ? new Date(dateString).getTime()
        : fallback || Date.now();

    if (Number.isNaN(timestamp)) {
        return "Recently";
    }

    const difference = Date.now() - timestamp;

    if (difference < 60 * 1000) {
        return "Just now";
    }

    const minutes = Math.floor(difference / (60 * 1000));

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hr${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days === 1) {
        return "Yesterday";
    }

    if (days < 7) {
        return `${days} days ago`;
    }

    return new Date(timestamp).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const createTransactionNotification = (
    transaction: WalletTransaction
): NotificationItem => {
    const transactionDate = transaction.date;
    const createdAt = new Date(transactionDate).getTime();

    if (transaction.type === "deposit") {
        return {
            id: `transaction-deposit-${transaction.id}`,
            title: "Wallet funded successfully",
            message: `${formatCurrency(
                transaction.amount
            )} was added to your HealthPay Wallet using ${
                transaction.paymentMethod || "your selected payment method"
            }.`,
            time: getRelativeTime(transactionDate, createdAt),
            icon: "add-circle",
            iconColor: "#16A34A",
            iconBackground: "#F0FDF4",
            cardBackground: "#F0FDF4",
            borderColor: "#B7F5D0",
            unread: true,
            createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt,
        };
    }

    if (transaction.type === "withdrawal") {
        return {
            id: `transaction-withdrawal-${transaction.id}`,
            title: "Withdrawal successful",
            message: `${formatCurrency(
                transaction.amount
            )} was withdrawn from your HealthPay Wallet${
                transaction.bank
                    ? ` to ${transaction.bank} account`
                    : ""
            }.`,
            time: getRelativeTime(transactionDate, createdAt),
            icon: "arrow-down-circle",
            iconColor: "#DC2626",
            iconBackground: "#FEF2F2",
            cardBackground: "#FFF7F7",
            borderColor: "#FECACA",
            unread: true,
            createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt,
        };
    }

    return {
        id: `transaction-payment-${transaction.id}`,
        title: "Payment successful",
        message: `${formatCurrency(
            transaction.amount
        )} paid for ${
            transaction.service || "healthcare service"
        }${
            transaction.facility
                ? ` at ${transaction.facility}`
                : ""
        }.`,
        time: getRelativeTime(transactionDate, createdAt),
        icon: "card",
        iconColor: "#2563EB",
        iconBackground: "#EFF6FF",
        cardBackground: "#EFF6FF",
        borderColor: "#BCD9FF",
        unread: true,
        createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt,
    };
};

const createAppointmentNotification = (
    appointment: Appointment
): NotificationItem => {
    const appointmentDate =
        appointment.updatedAt ||
        appointment.createdAt ||
        new Date().toISOString();

    const createdAt = new Date(appointmentDate).getTime();

    if (appointment.status === "Cancelled") {
        return {
            id: `appointment-${appointment.id}-cancelled`,
            title: "Appointment cancelled",
            message: `${appointment.service} at ${
                appointment.facility
            } has been cancelled.`,
            time: getRelativeTime(appointmentDate, createdAt),
            icon: "close-circle",
            iconColor: "#DC2626",
            iconBackground: "#FEF2F2",
            cardBackground: "#FFF7F7",
            borderColor: "#FECACA",
            unread: true,
            createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt,
        };
    }

    if (appointment.status === "Completed") {
        return {
            id: `appointment-${appointment.id}-completed`,
            title: "Appointment completed",
            message: `Your ${appointment.service} appointment at ${appointment.facility} was completed successfully.`,
            time: getRelativeTime(appointmentDate, createdAt),
            icon: "checkmark-circle",
            iconColor: "#16A34A",
            iconBackground: "#F0FDF4",
            cardBackground: "#F0FDFC",
            borderColor: "#8DEFE1",
            unread: true,
            createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt,
        };
    }

    return {
        id: `appointment-${appointment.id}-confirmed`,
        title: "Appointment booked",
        message: `${appointment.service} at ${
            appointment.facility
        } · ${appointment.date} · ${appointment.time}`,
        time: getRelativeTime(appointmentDate, createdAt),
        icon: "calendar",
        iconColor: "#16A34A",
        iconBackground: "#F0FFFC",
        cardBackground: "#F0FDFC",
        borderColor: "#8DEFE1",
        unread: true,
        createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt,
    };
};

const NotificationPage = () => {
    const router = useRouter();

    const [notifications, setNotifications] = useState<NotificationItem[]>(
        STATIC_NOTIFICATIONS
    );

    const loadNotifications = useCallback(async () => {
        try {
            const [transactionsData, appointmentsData] =
                await Promise.all([
                    AsyncStorage.getItem(WALLET_TRANSACTIONS_KEY),
                    AsyncStorage.getItem(APPOINTMENTS_KEY),
                ]);

            const transactions: WalletTransaction[] =
                transactionsData
                    ? JSON.parse(transactionsData)
                    : [];

            const appointments: Appointment[] =
                appointmentsData
                    ? JSON.parse(appointmentsData)
                    : [];

            const transactionNotifications =
                transactions
                    .filter(
                        (transaction) =>
                            transaction.status === "completed" ||
                            !transaction.status
                    )
                    .map(createTransactionNotification);

            const appointmentNotifications =
                appointments.map(createAppointmentNotification);

            const dynamicNotifications = [
                ...transactionNotifications,
                ...appointmentNotifications,
            ];

            const combinedNotifications = [
                ...STATIC_NOTIFICATIONS,
                ...dynamicNotifications,
            ].sort((a, b) => b.createdAt - a.createdAt);

            setNotifications(combinedNotifications);
        } catch (error) {
            console.error(
                "Error loading notifications:",
                error
            );

            setNotifications(STATIC_NOTIFICATIONS);
        }
    }, []);

    // Refresh notifications whenever this page becomes active.
    useFocusEffect(
        useCallback(() => {
            loadNotifications();
        }, [loadNotifications])
    );

    const unreadCount = notifications.filter(
        (item) => item.unread
    ).length;

    // Mark all notifications as read
    const markAllRead = () => {
        setNotifications((previous) =>
            previous.map((item) => ({
                ...item,
                unread: false,
            }))
        );
    };

    // Remove a single notification
    const removeNotification = (id: string) => {
        setNotifications((previous) =>
            previous.filter((item) => item.id !== id)
        );
    };

    // Mark a notification as read
    const openNotification = (id: string) => {
        setNotifications((previous) =>
            previous.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        unread: false,
                    }
                    : item
            )
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FFFFFF"
            />

            {/* HEADER */}
            <View className="border-b border-[#EEF2F6] px-5 pb-5 pt-4">
                <View className="flex-row items-center justify-between">
                    {/* BACK BUTTON */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-[66px] w-[66px] items-center justify-center rounded-[20px] border border-[#EAF0F6] bg-[#F8FAFC]"
                    >
                        <Ionicons
                            name="chevron-back"
                            size={28}
                            color="#0F172A"
                        />
                    </TouchableOpacity>

                    {/* TITLE */}
                    <View className="flex-1 px-5">
                        <Text className="font-bold text-[30px] text-[#0F172A]">
                            Notifications
                        </Text>

                        <Text className="mt-1 font-medium text-[20px] text-[#009E8F]">
                            {unreadCount} unread
                        </Text>
                    </View>

                    {/* MARK ALL READ */}
                    <TouchableOpacity
                        onPress={markAllRead}
                    >
                        <Text className="font-bold text-[17px] text-[#009E8F]">
                            Mark all read
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* NOTIFICATIONS LIST */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 120,
                }}
                showsVerticalScrollIndicator={false}
            >
                {notifications.map((item) => (
                    <Pressable
                        key={item.id}
                        onPress={() =>
                            openNotification(item.id)
                        }
                        className="mb-5 rounded-[30px] border-[3px] p-5"
                        style={{
                            backgroundColor:
                            item.cardBackground,
                            borderColor:
                            item.borderColor,
                        }}
                    >
                        <View className="flex-row items-start">
                            {/* ICON */}
                            <View
                                className="mr-5 h-[74px] w-[74px] items-center justify-center rounded-[23px] border-[3px]"
                                style={{
                                    backgroundColor:
                                    item.iconBackground,
                                    borderColor:
                                    item.borderColor,
                                }}
                            >
                                <Ionicons
                                    name={item.icon}
                                    size={34}
                                    color={item.iconColor}
                                />
                            </View>

                            {/* CONTENT */}
                            <View className="flex-1 pr-1">
                                <Text
                                    className="font-bold text-[22px] leading-[30px]"
                                    style={{
                                        color: item.unread
                                            ? "#0F172A"
                                            : "#334155",
                                    }}
                                >
                                    {item.title}
                                </Text>

                                <Text className="mt-2 text-[18px] leading-[29px] text-[#647B9B]">
                                    {item.message}
                                </Text>

                                <Text className="mt-4 text-[17px] font-medium text-[#8CA3C1]">
                                    {item.time}
                                </Text>
                            </View>

                            {/* DISMISS */}
                            <TouchableOpacity
                                onPress={() =>
                                    removeNotification(
                                        item.id
                                    )
                                }
                                className="ml-1 h-[38px] w-[38px] items-center justify-center rounded-full bg-[#F1F5F9]"
                            >
                                <Ionicons
                                    name="close"
                                    size={20}
                                    color="#8CA3C1"
                                />
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                ))}

                {/* EMPTY STATE */}
                {notifications.length === 0 && (
                    <View className="items-center justify-center py-20">
                        <Ionicons
                            name="notifications-off-outline"
                            size={60}
                            color="#94A3B8"
                        />

                        <Text className="mt-5 text-center text-xl font-bold text-[#0F172A]">
                            No notifications
                        </Text>

                        <Text className="mt-2 text-center text-base text-[#64748B]">
                            You're all caught up!
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default NotificationPage;
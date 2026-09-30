import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WalletBottomSheet from "@/components/WalletBottomSheet";
import { account } from "@/lib/appwrite";

const WALLET_TRANSACTIONS_KEY = "medicare_wallet_transactions";

type StoredTransaction = {
    id: string;
    type: "deposit" | "payment" | "withdrawal";
    amount: number;
    paymentMethod?: string;
    service?: string;
    facility?: string;
    bank?: string;
    accountLastFour?: string;
    accountName?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    status?: string;
    date: string;
};

type Transaction = {
    id: string;
    title: string;
    provider: string;
    amount: string;
    type: "Debit" | "Credit";
};

export default function HistoryScreen() {
    const [userName, setUserName] = useState("User");
    const [history, setHistory] = useState<Transaction[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        try {
            // Load logged-in user
            try {
                const user = await account.get();
                setUserName(user.name || "User");
            } catch (error) {
                console.log("Unable to load logged-in user:", error);
                setUserName("User");
            }

            // Load transactions
            const storedTransactions =
                await AsyncStorage.getItem(
                    WALLET_TRANSACTIONS_KEY
                );

            if (!storedTransactions) {
                setHistory([]);
                return;
            }

            const transactions: StoredTransaction[] =
                JSON.parse(storedTransactions);

            // Convert stored transactions into the format
            // used by your existing UI
            const formattedHistory: Transaction[] =
                transactions
                    .sort(
                        (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                    )
                    .map((transaction) => {
                        // ADD MONEY
                        if (transaction.type === "deposit") {
                            return {
                                id: transaction.id,
                                title: "Wallet Funding",
                                provider:
                                    transaction.paymentMethod ||
                                    "Payment Method",
                                amount: `+ ₦${formatAmount(
                                    transaction.amount
                                )}`,
                                type: "Credit",
                            };
                        }

                        // PAYMENT
                        if (transaction.type === "payment") {
                            return {
                                id: transaction.id,
                                title:
                                    transaction.service ||
                                    "Healthcare Payment",
                                provider:
                                    transaction.facility ||
                                    "Healthcare Facility",
                                amount: `− ₦${formatAmount(
                                    transaction.amount
                                )}`,
                                type: "Debit",
                            };
                        }

                        // WITHDRAWAL
                        if (transaction.type === "withdrawal") {
                            return {
                                id: transaction.id,
                                title: "Wallet Withdrawal",
                                provider: transaction.bank
                                    ? `${transaction.bank} ••••${
                                        transaction.accountLastFour ||
                                        ""
                                    }`
                                    : "Bank Account",
                                amount: `− ₦${formatAmount(
                                    transaction.amount
                                )}`,
                                type: "Debit",
                            };
                        }

                        // Fallback
                        return {
                            id: transaction.id,
                            title: "Wallet Transaction",
                            provider: transaction.paymentMethod || "Wallet",
                            amount: `₦${formatAmount(
                                transaction.amount
                            )}`,
                            type: "Debit",
                        };
                    });

            setHistory(formattedHistory);
        } catch (error) {
            console.log(
                "Unable to load transaction history:",
                error
            );

            setHistory([]);
        }
    };

    const formatAmount = (amount: number) => {
        return Number(amount || 0).toLocaleString("en-NG");
    };

    return (
        <WalletBottomSheet
            title="Transaction History"
            subtitle="View your wallet transactions"
            icon="time-outline"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {history.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="receipt-outline"
                                size={30}
                                color="#91A5C2"
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            No transactions yet
                        </Text>

                        <Text style={styles.emptyText}>
                            Your wallet transactions will appear here once
                            you fund your wallet or make a payment.
                        </Text>
                    </View>
                ) : (
                    history.map((item) => {
                        const isDebit =
                            item.type === "Debit";

                        return (
                            <View
                                key={item.id}
                                style={styles.transaction}
                            >
                                {/* Transaction Icon */}
                                <View style={styles.icon}>
                                    <Ionicons
                                        name={
                                            isDebit
                                                ? "arrow-up-outline"
                                                : "arrow-down-outline"
                                        }
                                        size={22}
                                        color={
                                            isDebit
                                                ? "#EF4444"
                                                : "#16A34A"
                                        }
                                    />
                                </View>

                                {/* Transaction Details */}
                                <View style={styles.details}>
                                    <Text style={styles.title}>
                                        {item.title}
                                    </Text>

                                    <Text style={styles.provider}>
                                        {item.provider}
                                    </Text>
                                </View>

                                {/* Amount */}
                                <View style={styles.amount}>
                                    <Text
                                        style={[
                                            styles.amountText,
                                            {
                                                color: isDebit
                                                    ? "#EF4444"
                                                    : "#16A34A",
                                            },
                                        ]}
                                    >
                                        {item.amount}
                                    </Text>

                                    <Text style={styles.type}>
                                        {item.type}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </WalletBottomSheet>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
    },

    transaction: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6",
    },

    icon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: "#F7FAFC",
        alignItems: "center",
        justifyContent: "center",
    },

    details: {
        flex: 1,
        marginLeft: 14,
    },

    title: {
        color: "#17233D",
        fontSize: 15,
        fontWeight: "700",
    },

    provider: {
        color: "#91A5C2",
        fontSize: 12,
        marginTop: 5,
    },

    amount: {
        alignItems: "flex-end",
        marginLeft: 8,
    },

    amountText: {
        fontSize: 14,
        fontWeight: "800",
    },

    type: {
        color: "#91A5C2",
        fontSize: 12,
        marginTop: 5,
    },

    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 70,
        paddingHorizontal: 30,
    },

    emptyIcon: {
        width: 64,
        height: 64,
        borderRadius: 22,
        backgroundColor: "#F7FAFC",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    emptyTitle: {
        color: "#17233D",
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
    },

    emptyText: {
        color: "#91A5C2",
        fontSize: 13,
        lineHeight: 20,
        textAlign: "center",
        marginTop: 8,
    },
});
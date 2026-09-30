import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { account } from "@/lib/appwrite";

const WALLET_BALANCE_KEY = "medicare_wallet_balance";
const WALLET_TRANSACTIONS_KEY = "medicare_wallet_transactions";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

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
    date: string;
    amount: string;
    amountValue: number;
    type: "debit" | "credit";
    icon: IconName;
    iconColor: string;
};

const Wallet = () => {
    const router = useRouter();

    const [showBalance, setShowBalance] = useState(true);

    // Logged-in user
    const [userName, setUserName] = useState("");
    const [walletId, setWalletId] = useState("");

    // Wallet balance
    const [balance, setBalance] = useState(0);

    // Wallet transactions
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Loading state
    const [loadingUser, setLoadingUser] = useState(true);

    /*
     * ---------------------------------------------------------
     * LOAD WALLET
     * ---------------------------------------------------------
     *
     * This runs every time the Wallet screen becomes active.
     *
     * That means:
     *
     * Add Money → back to Wallet → new balance appears
     * Pay → back to Wallet → new balance appears
     * Withdraw → back to Wallet → new balance appears
     */

    useFocusEffect(
        useCallback(() => {
            loadWallet();
        }, [])
    );

    const loadWallet = async () => {
        try {
            /*
             * -------------------------------------------------
             * LOAD LOGGED-IN USER
             * -------------------------------------------------
             */

            try {
                const user = await account.get();

                setUserName(user.name || "User");

                setWalletId(
                    `HP-${user.$id.slice(-8).toUpperCase()}-NGR`
                );
            } catch (error) {
                console.log(
                    "Unable to load wallet user:",
                    error
                );

                setUserName("User");
                setWalletId("HP-00000000-NGR");
            } finally {
                setLoadingUser(false);
            }

            /*
             * -------------------------------------------------
             * LOAD CURRENT WALLET BALANCE
             * -------------------------------------------------
             */

            const storedBalance =
                await AsyncStorage.getItem(
                    WALLET_BALANCE_KEY
                );

            if (storedBalance !== null) {
                const numericBalance =
                    Number(storedBalance);

                setBalance(
                    Number.isFinite(numericBalance)
                        ? numericBalance
                        : 0
                );
            } else {
                // New users start with ₦0
                setBalance(0);
            }

            /*
             * -------------------------------------------------
             * LOAD TRANSACTIONS
             * -------------------------------------------------
             */

            const storedTransactions =
                await AsyncStorage.getItem(
                    WALLET_TRANSACTIONS_KEY
                );

            if (!storedTransactions) {
                setTransactions([]);
                return;
            }

            const parsedTransactions: StoredTransaction[] =
                JSON.parse(storedTransactions);

            /*
             * Sort newest transaction first.
             */
            const sortedTransactions =
                parsedTransactions.sort(
                    (a, b) =>
                        new Date(b.date).getTime() -
                        new Date(a.date).getTime()
                );

            /*
             * Convert stored transactions into the
             * format required by the existing UI.
             */
            const formattedTransactions =
                sortedTransactions.map(
                    (transaction): Transaction => {
                        /*
                         * -------------------------------------
                         * ADD MONEY / DEPOSIT
                         * -------------------------------------
                         */
                        if (
                            transaction.type ===
                            "deposit"
                        ) {
                            return {
                                id: transaction.id,
                                title: "Wallet Funding",

                                provider:
                                    transaction.paymentMethod ||
                                    "Payment Method",

                                date: formatDate(
                                    transaction.date
                                ),

                                amount: formatCurrency(
                                    transaction.amount
                                ),

                                amountValue:
                                transaction.amount,

                                type: "credit",

                                icon: "arrow-down-outline",

                                iconColor: "#00A63C",
                            };
                        }

                        /*
                         * -------------------------------------
                         * PAYMENT
                         * -------------------------------------
                         */
                        if (
                            transaction.type ===
                            "payment"
                        ) {
                            return {
                                id: transaction.id,

                                title:
                                    transaction.service ||
                                    "Healthcare Payment",

                                provider:
                                    transaction.facility ||
                                    "Healthcare Facility",

                                date: formatDate(
                                    transaction.date
                                ),

                                amount: formatCurrency(
                                    transaction.amount
                                ),

                                amountValue:
                                transaction.amount,

                                type: "debit",

                                icon: "arrow-up-outline",

                                iconColor: "#FF3B40",
                            };
                        }

                        /*
                         * -------------------------------------
                         * WITHDRAWAL
                         * -------------------------------------
                         */
                        if (
                            transaction.type ===
                            "withdrawal"
                        ) {
                            return {
                                id: transaction.id,

                                title: "Wallet Withdrawal",

                                provider:
                                    transaction.bank
                                        ? `${transaction.bank} ••••${
                                            transaction.accountLastFour ||
                                            ""
                                        }`
                                        : "Bank Account",

                                date: formatDate(
                                    transaction.date
                                ),

                                amount: formatCurrency(
                                    transaction.amount
                                ),

                                amountValue:
                                transaction.amount,

                                type: "debit",

                                icon: "arrow-up-outline",

                                iconColor: "#FF3B40",
                            };
                        }

                        /*
                         * -------------------------------------
                         * FALLBACK
                         * -------------------------------------
                         */
                        return {
                            id: transaction.id,

                            title: "Wallet Transaction",

                            provider:
                                transaction.paymentMethod ||
                                "Wallet",

                            date: formatDate(
                                transaction.date
                            ),

                            amount: formatCurrency(
                                transaction.amount
                            ),

                            amountValue:
                            transaction.amount,

                            type: "debit",

                            icon: "wallet-outline",

                            iconColor: "#FF3B40",
                        };
                    }
                );

            setTransactions(formattedTransactions);
        } catch (error) {
            console.log(
                "Unable to load wallet:",
                error
            );

            setBalance(0);
            setTransactions([]);
        }
    };

    /*
     * ---------------------------------------------------------
     * FORMAT CURRENCY
     * ---------------------------------------------------------
     */

    const formatCurrency = (amount: number) => {
        return `₦${Number(amount || 0).toLocaleString(
            "en-NG"
        )}`;
    };

    /*
     * ---------------------------------------------------------
     * FORMAT DATE
     * ---------------------------------------------------------
     */

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);

            return date.toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        } catch {
            return "";
        }
    };

    /*
     * ---------------------------------------------------------
     * TOTAL FUNDED
     * ---------------------------------------------------------
     */

    const totalFunded = transactions
        .filter(
            (transaction) =>
                transaction.type === "credit"
        )
        .reduce(
            (total, transaction) =>
                total + transaction.amountValue,
            0
        );

    /*
     * ---------------------------------------------------------
     * TOTAL SPENT
     *
     * Includes:
     * - Healthcare payments
     * - Withdrawals
     * ---------------------------------------------------------
     */

    const totalSpent = transactions
        .filter(
            (transaction) =>
                transaction.type === "debit"
        )
        .reduce(
            (total, transaction) =>
                total + transaction.amountValue,
            0
        );

    /*
     * ---------------------------------------------------------
     * RECENT TRANSACTIONS
     *
     * Only show the latest 3 on the main wallet.
     *
     * The History page contains everything.
     * ---------------------------------------------------------
     */

    const recentTransactions =
        transactions.slice(0, 3);

    /*
     * ---------------------------------------------------------
     * WALLET ACTIONS
     * ---------------------------------------------------------
     */

    const handleAction = (action: string) => {
        switch (action) {
            case "add":
                router.push("/wallet/add-money");
                break;

            case "withdraw":
                router.push("/wallet/withdrawal");
                break;

            case "pay":
                router.push("/wallet/pay");
                break;

            case "history":
                router.push("/wallet/history");
                break;
        }
    };

    return (
        <SafeAreaView
            edges={["top"]}
            style={styles.safeArea}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* WALLET HERO */}
                <LinearGradient
                    colors={[
                        "#078F84",
                        "#079B8F",
                        "#0793B6",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.walletHero}
                >
                    {/* DECORATIVE CIRCLES */}
                    <View style={styles.circleLarge} />
                    <View style={styles.circleSmall} />
                    <View style={styles.circleBottom} />

                    {/* WALLET HEADER */}
                    <View style={styles.heroHeader}>
                        <View>
                            <Text
                                style={styles.walletLabel}
                            >
                                HEALTHPAY WALLET
                            </Text>

                            <Text
                                style={styles.userName}
                            >
                                {loadingUser
                                    ? "Loading..."
                                    : userName}
                            </Text>
                        </View>

                        <View
                            style={
                                styles.cardIconContainer
                            }
                        >
                            <Ionicons
                                name="card-outline"
                                size={34}
                                color="#FFFFFF"
                            />
                        </View>
                    </View>

                    {/* BALANCE */}
                    <View style={styles.balanceSection}>
                        <Text
                            style={styles.balanceLabel}
                        >
                            Available balance
                        </Text>

                        <View style={styles.balanceRow}>
                            <Text
                                style={styles.balanceText}
                            >
                                {showBalance
                                    ? formatCurrency(
                                        balance
                                    )
                                    : "₦••••••"}
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    setShowBalance(
                                        !showBalance
                                    )
                                }
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={
                                        showBalance
                                            ? "eye-outline"
                                            : "eye-off-outline"
                                    }
                                    size={34}
                                    color="#B4EAE4"
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.walletId}>
                            Wallet ID: {walletId}
                        </Text>
                    </View>

                    {/* WALLET ACTIONS */}
                    <View style={styles.actionsRow}>
                        <WalletAction
                            icon="add"
                            label="Add Money"
                            onPress={() =>
                                handleAction("add")
                            }
                        />

                        <WalletAction
                            icon="arrow-down"
                            label="Withdraw"
                            onPress={() =>
                                handleAction(
                                    "withdraw"
                                )
                            }
                        />

                        <WalletAction
                            icon="arrow-forward"
                            label="Pay"
                            onPress={() =>
                                handleAction("pay")
                            }
                        />

                        <WalletAction
                            icon="time-outline"
                            label="History"
                            onPress={() =>
                                handleAction(
                                    "history"
                                )
                            }
                        />
                    </View>
                </LinearGradient>

                {/* SUMMARY CARDS */}
                <View style={styles.summaryContainer}>
                    <SummaryCard
                        amount={
                            transactions.length > 0
                                ? formatCurrency(
                                    totalSpent
                                )
                                : "—"
                        }
                        label="Total spent"
                        subLabel="All time"
                        amountColor="#D97706"
                    />

                    <SummaryCard
                        amount={
                            transactions.length > 0
                                ? formatCurrency(
                                    totalFunded
                                )
                                : "—"
                        }
                        label="Total funded"
                        subLabel="All time"
                        amountColor="#079B8F"
                    />

                    <SummaryCard
                        amount={
                            transactions.length > 0
                                ? transactions.length.toString()
                                : "—"
                        }
                        label="Transactions"
                        subLabel="All time"
                        amountColor="#4F46E5"
                    />
                </View>

                {/* RECENT TRANSACTIONS HEADER */}
                <View style={styles.sectionHeader}>
                    <Text
                        style={styles.sectionTitle}
                    >
                        Recent transactions
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            handleAction("history")
                        }
                        activeOpacity={0.8}
                    >
                        <Text
                            style={styles.seeAllText}
                        >
                            See all
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* TRANSACTION LIST */}
                <View
                    style={
                        styles.transactionsContainer
                    }
                >
                    {recentTransactions.length ===
                    0 ? (
                        <View
                            style={
                                styles.emptyTransactions
                            }
                        >
                            <View
                                style={
                                    styles.emptyTransactionIcon
                                }
                            >
                                <Ionicons
                                    name="receipt-outline"
                                    size={28}
                                    color="#91A5C2"
                                />
                            </View>

                            <Text
                                style={
                                    styles.emptyTransactionTitle
                                }
                            >
                                No transactions yet
                            </Text>

                            <Text
                                style={
                                    styles.emptyTransactionText
                                }
                            >
                                Your recent wallet
                                transactions will
                                appear here.
                            </Text>
                        </View>
                    ) : (
                        recentTransactions.map(
                            (
                                transaction,
                                index
                            ) => (
                                <TouchableOpacity
                                    key={
                                        transaction.id
                                    }
                                    activeOpacity={0.8}
                                    onPress={() => {}}
                                    style={[
                                        styles.transactionRow,
                                        index ===
                                        recentTransactions.length -
                                        1 &&
                                        styles.lastTransaction,
                                    ]}
                                >
                                    {/* TRANSACTION ICON */}
                                    <View
                                        style={
                                            styles.transactionIcon
                                        }
                                    >
                                        <Ionicons
                                            name={
                                                transaction.icon
                                            }
                                            size={26}
                                            color={
                                                transaction.iconColor
                                            }
                                        />
                                    </View>

                                    {/* TRANSACTION DETAILS */}
                                    <View
                                        style={
                                            styles.transactionDetails
                                        }
                                    >
                                        <Text
                                            numberOfLines={
                                                1
                                            }
                                            style={
                                                styles.transactionTitle
                                            }
                                        >
                                            {
                                                transaction.title
                                            }
                                        </Text>

                                        <Text
                                            numberOfLines={
                                                1
                                            }
                                            style={
                                                styles.transactionProvider
                                            }
                                        >
                                            {
                                                transaction.provider
                                            }{" "}
                                            ·{" "}
                                            {
                                                transaction.date
                                            }
                                        </Text>
                                    </View>

                                    {/* TRANSACTION AMOUNT */}
                                    <View
                                        style={
                                            styles.amountContainer
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.transactionAmount,
                                                {
                                                    color:
                                                        transaction.type ===
                                                        "debit"
                                                            ? "#FF3B40"
                                                            : "#00A63C",
                                                },
                                            ]}
                                        >
                                            {transaction.type ===
                                            "debit"
                                                ? "−"
                                                : "+"}
                                            {
                                                transaction.amount
                                            }
                                        </Text>

                                        <Text
                                            style={[
                                                styles.transactionType,
                                                {
                                                    color:
                                                        transaction.type ===
                                                        "debit"
                                                            ? "#8EA1BD"
                                                            : "#00A63C",
                                                },
                                            ]}
                                        >
                                            {transaction.type ===
                                            "debit"
                                                ? "Debit"
                                                : "Credit"}
                                        </Text>
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

/* WALLET ACTION COMPONENT */

type WalletActionProps = {
    icon: IconName;
    label: string;
    onPress: () => void;
};

const WalletAction = ({
                          icon,
                          label,
                          onPress,
                      }: WalletActionProps) => {
    return (
        <TouchableOpacity
            style={styles.actionItem}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.actionIcon}>
                <Ionicons
                    name={icon}
                    size={32}
                    color="#FFFFFF"
                />
            </View>

            <Text style={styles.actionLabel}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

/* SUMMARY CARD COMPONENT */

type SummaryCardProps = {
    amount: string;
    label: string;
    subLabel: string;
    amountColor: string;
};

const SummaryCard = ({
                         amount,
                         label,
                         subLabel,
                         amountColor,
                     }: SummaryCardProps) => {
    return (
        <View style={styles.summaryCard}>
            <Text
                style={[
                    styles.summaryAmount,
                    {
                        color: amountColor,
                    },
                ]}
            >
                {amount}
            </Text>

            <Text style={styles.summaryLabel}>
                {label}
            </Text>

            <Text style={styles.summarySubLabel}>
                {subLabel}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    scrollContent: {
        paddingBottom: 32,
    },

    /* WALLET HERO */

    walletHero: {
        minHeight: 536,
        paddingHorizontal: 34,
        paddingTop: 42,
        paddingBottom: 28,
        overflow: "hidden",
    },

    circleLarge: {
        position: "absolute",
        width: 360,
        height: 360,
        borderRadius: 180,
        backgroundColor:
            "rgba(255,255,255,0.09)",
        right: -105,
        top: -110,
    },

    circleSmall: {
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor:
            "rgba(255,255,255,0.08)",
        left: -80,
        bottom: 25,
    },

    circleBottom: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor:
            "rgba(255,255,255,0.10)",
        right: 10,
        bottom: -35,
    },

    heroHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    walletLabel: {
        color: "#B6F3EB",
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: 2,
    },

    userName: {
        color: "#E6FFFC",
        fontSize: 22,
        fontWeight: "600",
        marginTop: 14,
    },

    cardIconContainer: {
        width: 74,
        height: 74,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
            "rgba(255,255,255,0.16)",
        borderWidth: 3,
        borderColor:
            "rgba(255,255,255,0.25)",
    },

    balanceSection: {
        marginTop: 50,
    },

    balanceLabel: {
        fontSize: 20,
        color: "#B4F1EA",
        fontWeight: "500",
    },

    balanceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        gap: 18,
    },

    balanceText: {
        color: "#FFFFFF",
        fontSize: 54,
        fontWeight: "800",
        letterSpacing: -2,
    },

    walletId: {
        color: "#A9EDE5",
        fontSize: 19,
        marginTop: 12,
    },

    /* ACTIONS */

    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: 44,
    },

    actionItem: {
        alignItems: "center",
        width: "24%",
    },

    actionIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
            "rgba(255,255,255,0.18)",
        borderWidth: 3,
        borderColor:
            "rgba(255,255,255,0.25)",
    },

    actionLabel: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        marginTop: 16,
        textAlign: "center",
    },

    /* SUMMARY */

    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        marginTop: 14,
        gap: 12,
    },

    summaryCard: {
        flex: 1,
        minHeight: 126,
        borderRadius: 24,
        borderWidth: 3,
        borderColor: "#EEF2F6",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
        shadowColor: "#AAB5C5",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 3,
    },

    summaryAmount: {
        fontSize: 23,
        fontWeight: "800",
        textAlign: "center",
    },

    summaryLabel: {
        color: "#627692",
        fontSize: 15,
        fontWeight: "700",
        marginTop: 10,
        textAlign: "center",
    },

    summarySubLabel: {
        color: "#91A5C2",
        fontSize: 14,
        marginTop: 5,
        textAlign: "center",
    },

    /* SECTION HEADER */

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        marginTop: 42,
        marginBottom: 18,
    },

    sectionTitle: {
        color: "#17233D",
        fontSize: 25,
        fontWeight: "800",
    },

    seeAllText: {
        color: "#079B8F",
        fontSize: 18,
        fontWeight: "800",
    },

    /* TRANSACTIONS */

    transactionsContainer: {
        marginHorizontal: 24,
        borderRadius: 28,
        borderWidth: 3,
        borderColor: "#F0F4F9",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    transactionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 22,
        paddingVertical: 22,
        minHeight: 112,
        borderBottomWidth: 2,
        borderBottomColor: "#F0F4F9",
    },

    lastTransaction: {
        borderBottomWidth: 0,
    },

    transactionIcon: {
        width: 68,
        height: 68,
        borderRadius: 22,
        backgroundColor: "#F7FAFC",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 18,
    },

    transactionDetails: {
        flex: 1,
        minWidth: 0,
    },

    transactionTitle: {
        color: "#17233D",
        fontSize: 17,
        fontWeight: "800",
    },

    transactionProvider: {
        color: "#91A5C2",
        fontSize: 14,
        marginTop: 8,
    },

    amountContainer: {
        alignItems: "flex-end",
        marginLeft: 8,
    },

    transactionAmount: {
        fontSize: 17,
        fontWeight: "800",
        textAlign: "right",
    },

    transactionType: {
        fontSize: 14,
        fontWeight: "700",
        marginTop: 8,
    },

    /* EMPTY TRANSACTIONS */

    emptyTransactions: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 42,
        paddingHorizontal: 25,
    },

    emptyTransactionIcon: {
        width: 58,
        height: 58,
        borderRadius: 20,
        backgroundColor: "#F7FAFC",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    emptyTransactionTitle: {
        color: "#17233D",
        fontSize: 16,
        fontWeight: "800",
        textAlign: "center",
    },

    emptyTransactionText: {
        color: "#91A5C2",
        fontSize: 13,
        lineHeight: 19,
        textAlign: "center",
        marginTop: 6,
    },
});

export default Wallet;
import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { account } from "@/lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WALLET_BALANCE_KEY = "medicare_wallet_balance";
const WALLET_TRANSACTIONS_KEY = "medicare_wallet_transactions";

const quickAmounts = [5000, 10000, 20000, 50000];

const formatAmount = (value: number) => {
    return `₦${value.toLocaleString("en-NG")}`;
};

export default function WithdrawScreen() {
    const router = useRouter();

    const [amount, setAmount] = useState("");
    const [selectedQuickAmount, setSelectedQuickAmount] =
        useState<number | null>(null);

    const [userName, setUserName] = useState("User");

    // Wallet balance comes from the same local storage
    // used by Add Money and Pay pages.
    const [walletBalance, setWalletBalance] = useState(0);

    const [isProcessing, setIsProcessing] = useState(false);

    /*
     * ---------------------------------------------------------
     * GET LOGGED-IN USER
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await account.get();

                setUserName(user.name || "User");
            } catch (error) {
                console.log(
                    "Unable to load logged-in user:",
                    error
                );

                setUserName("User");
            }
        };

        loadUser();
    }, []);

    /*
     * ---------------------------------------------------------
     * LOAD WALLET BALANCE
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const loadWalletBalance = async () => {
            try {
                const storedBalance =
                    await AsyncStorage.getItem(
                        WALLET_BALANCE_KEY
                    );

                const balance = storedBalance
                    ? Number(storedBalance)
                    : 0;

                setWalletBalance(balance);
            } catch (error) {
                console.log(
                    "Unable to load wallet balance:",
                    error
                );

                setWalletBalance(0);
            }
        };

        loadWalletBalance();
    }, []);

    /*
     * ---------------------------------------------------------
     * CALCULATE AMOUNT
     * ---------------------------------------------------------
     */
    const numericAmount = useMemo(() => {
        const cleaned = amount.replace(/[^0-9]/g, "");

        return Number(cleaned) || 0;
    }, [amount]);

    /*
     * ---------------------------------------------------------
     * VALIDATION
     * ---------------------------------------------------------
     */
    const isAmountValid =
        numericAmount > 0 &&
        numericAmount <= walletBalance;

    const exceedsBalance =
        numericAmount > walletBalance;

    /*
     * ---------------------------------------------------------
     * QUICK AMOUNT
     * ---------------------------------------------------------
     */
    const handleQuickAmount = (value: number) => {
        setAmount(value.toString());
        setSelectedQuickAmount(value);
    };

    /*
     * ---------------------------------------------------------
     * CUSTOM AMOUNT
     * ---------------------------------------------------------
     */
    const handleAmountChange = (value: string) => {
        const cleaned = value.replace(/[^0-9]/g, "");

        setAmount(cleaned);

        const numericValue = Number(cleaned) || 0;

        setSelectedQuickAmount(
            quickAmounts.includes(numericValue)
                ? numericValue
                : null
        );
    };

    /*
     * ---------------------------------------------------------
     * SAVE WITHDRAWAL TRANSACTION
     * ---------------------------------------------------------
     */
    const saveWithdrawalTransaction = async () => {
        try {
            const existingTransactions =
                await AsyncStorage.getItem(
                    WALLET_TRANSACTIONS_KEY
                );

            const transactions = existingTransactions
                ? JSON.parse(existingTransactions)
                : [];

            const withdrawalTransaction = {
                id: Date.now().toString(),

                // Used by the History page
                type: "withdrawal",

                amount: numericAmount,

                paymentMethod: "GTBank",

                bank: "GTBank",

                accountLastFour: "7742",

                accountName: userName,

                status: "completed",

                date: new Date().toISOString(),
            };

            const updatedTransactions = [
                withdrawalTransaction,
                ...transactions,
            ];

            await AsyncStorage.setItem(
                WALLET_TRANSACTIONS_KEY,
                JSON.stringify(updatedTransactions)
            );
        } catch (error) {
            console.log(
                "Unable to save withdrawal transaction:",
                error
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * WITHDRAW MONEY
     * ---------------------------------------------------------
     */
    const handleWithdraw = async () => {
        if (isProcessing) return;

        if (numericAmount <= 0) {
            return;
        }

        /*
         * Always read the latest wallet balance before
         * performing the withdrawal.
         */
        try {
            const storedBalance =
                await AsyncStorage.getItem(
                    WALLET_BALANCE_KEY
                );

            const currentBalance = storedBalance
                ? Number(storedBalance)
                : 0;

            /*
             * Prevent withdrawal if the latest balance
             * is no longer sufficient.
             */
            if (numericAmount > currentBalance) {
                setWalletBalance(currentBalance);

                Alert.alert(
                    "Insufficient Balance",
                    `You only have ${formatAmount(
                        currentBalance
                    )} available in your wallet.`
                );

                return;
            }

            setIsProcessing(true);

            /*
             * Simulate withdrawal processing.
             *
             * No real bank transfer happens here.
             */
            await new Promise((resolve) =>
                setTimeout(resolve, 1500)
            );

            /*
             * Calculate new balance.
             */
            const newBalance =
                currentBalance - numericAmount;

            /*
             * Update the MAIN wallet balance.
             */
            await AsyncStorage.setItem(
                WALLET_BALANCE_KEY,
                newBalance.toString()
            );

            /*
             * Update this page immediately.
             */
            setWalletBalance(newBalance);

            /*
             * Save withdrawal in transaction history.
             */
            await saveWithdrawalTransaction();

            setIsProcessing(false);

            /*
             * Show success.
             */
            Alert.alert(
                "Withdrawal Successful",
                `${formatAmount(
                    numericAmount
                )} has been withdrawn from your wallet and sent to your registered bank account.`,
                [
                    {
                        text: "Done",
                        onPress: () => {
                            router.back();
                        },
                    },
                ]
            );
        } catch (error) {
            console.log(
                "Withdrawal error:",
                error
            );

            setIsProcessing(false);

            Alert.alert(
                "Withdrawal Failed",
                "Something went wrong while processing your withdrawal. Please try again."
            );
        }
    };

    return (
        <View style={styles.overlay}>
            {/* BACKDROP */}
            <Pressable
                style={styles.backdrop}
                disabled={isProcessing}
                onPress={() => router.back()}
            />

            {/* BOTTOM SHEET */}
            <KeyboardAvoidingView
                behavior={
                    Platform.OS === "ios" ? "padding" : undefined
                }
                style={styles.sheetWrapper}
            >
                <View style={styles.sheet}>
                    {/* DRAG HANDLE */}
                    <View style={styles.handle} />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* HEADER */}
                        <View style={styles.header}>
                            <View style={styles.headerText}>
                                <Text style={styles.title}>
                                    Withdraw funds
                                </Text>

                                <Text style={styles.subtitle}>
                                    Withdraw to your registered bank
                                    account. Transfers arrive within
                                    minutes.
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    if (!isProcessing) {
                                        router.back();
                                    }
                                }}
                                style={styles.closeButton}
                                activeOpacity={0.8}
                                disabled={isProcessing}
                            >
                                <Ionicons
                                    name="close"
                                    size={22}
                                    color="#52637D"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* REGISTERED BANK ACCOUNT */}
                        <View style={styles.bankCard}>
                            <View style={styles.bankIconContainer}>
                                <Ionicons
                                    name="business"
                                    size={34}
                                    color="#64748B"
                                />
                            </View>

                            <View style={styles.bankDetails}>
                                <Text style={styles.bankName}>
                                    GTBank
                                </Text>

                                <Text style={styles.accountName}>
                                    {userName} · ••••7742
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={isProcessing}
                                onPress={() => {
                                    Alert.alert(
                                        "Bank Account",
                                        "Bank account selection will be connected to your backend later."
                                    );
                                }}
                            >
                                <Text style={styles.changeText}>
                                    Change
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* QUICK AMOUNTS */}
                        <Text style={styles.sectionLabel}>
                            QUICK AMOUNTS
                        </Text>

                        <View style={styles.quickAmountsRow}>
                            {quickAmounts.map((value) => {
                                const isSelected =
                                    selectedQuickAmount === value;

                                /*
                                 * Disable quick amounts that are
                                 * greater than the current balance.
                                 */
                                const isUnavailable =
                                    value > walletBalance;

                                return (
                                    <TouchableOpacity
                                        key={value}
                                        activeOpacity={0.8}
                                        disabled={
                                            isProcessing ||
                                            isUnavailable
                                        }
                                        onPress={() =>
                                            handleQuickAmount(value)
                                        }
                                        style={[
                                            styles.quickAmountButton,

                                            isSelected &&
                                            styles.quickAmountSelected,

                                            isUnavailable &&
                                            styles.quickAmountDisabled,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.quickAmountText,

                                                isSelected &&
                                                styles.quickAmountSelectedText,

                                                isUnavailable &&
                                                styles.quickAmountDisabledText,
                                            ]}
                                        >
                                            {formatAmount(value)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* AMOUNT INPUT */}
                        <View
                            style={[
                                styles.inputContainer,

                                exceedsBalance &&
                                styles.inputError,
                            ]}
                        >
                            <TextInput
                                value={amount}
                                onChangeText={handleAmountChange}
                                placeholder="Enter amount"
                                placeholderTextColor="#C7D3E2"
                                keyboardType="number-pad"
                                style={styles.amountInput}
                                editable={!isProcessing}
                            />
                        </View>

                        {/* BALANCE INFORMATION */}
                        <View style={styles.balanceInfo}>
                            <Ionicons
                                name="information-circle-outline"
                                size={23}
                                color="#91A5C2"
                            />

                            <Text style={styles.availableText}>
                                Available:{" "}
                                <Text style={styles.availableAmount}>
                                    {formatAmount(
                                        walletBalance
                                    )}
                                </Text>
                            </Text>
                        </View>

                        {/* INSUFFICIENT BALANCE MESSAGE */}
                        {exceedsBalance && (
                            <Text style={styles.errorText}>
                                Amount exceeds your available
                                balance.
                            </Text>
                        )}

                        {/* WITHDRAW BUTTON */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={
                                !isAmountValid ||
                                isProcessing
                            }
                            onPress={handleWithdraw}
                            style={[
                                styles.withdrawButton,

                                (!isAmountValid ||
                                    isProcessing) &&
                                styles.withdrawButtonDisabled,
                            ]}
                        >
                            {isProcessing ? (
                                <View
                                    style={
                                        styles.processingContainer
                                    }
                                >
                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />

                                    <Text
                                        style={[
                                            styles.withdrawButtonText,
                                            {
                                                marginLeft: 10,
                                            },
                                        ]}
                                    >
                                        Processing...
                                    </Text>
                                </View>
                            ) : (
                                <Text
                                    style={[
                                        styles.withdrawButtonText,

                                        !isAmountValid &&
                                        styles.withdrawButtonTextDisabled,
                                    ]}
                                >
                                    {numericAmount > 0
                                        ? `Withdraw ${formatAmount(
                                            numericAmount
                                        )}`
                                        : "Withdraw Funds"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(10, 25, 45, 0.52)",
    },

    sheetWrapper: {
        width: "100%",
        maxHeight: "94%",
    },

    sheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
        paddingTop: 14,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },

    handle: {
        width: 80,
        height: 7,
        borderRadius: 20,
        backgroundColor: "#E0E7F0",
        alignSelf: "center",
        marginBottom: 36,
    },

    scrollContent: {
        paddingBottom: 12,
    },

    /* HEADER */
    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },

    headerText: {
        flex: 1,
        paddingRight: 12,
    },

    title: {
        fontSize: 27,
        fontWeight: "800",
        color: "#17233D",
        letterSpacing: -0.5,
    },

    subtitle: {
        fontSize: 18,
        lineHeight: 27,
        color: "#627692",
        marginTop: 14,
    },

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F0F4F9",
        justifyContent: "center",
        alignItems: "center",
    },

    /* BANK ACCOUNT */
    bankCard: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#E1E8F1",
        backgroundColor: "#F9FBFD",
        borderRadius: 24,
        padding: 22,
        marginTop: 34,
    },

    bankIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 22,
        backgroundColor: "#D9FBE7",
        alignItems: "center",
        justifyContent: "center",
    },

    bankDetails: {
        flex: 1,
        marginLeft: 20,
        marginRight: 8,
    },

    bankName: {
        fontSize: 25,
        fontWeight: "800",
        color: "#17233D",
    },

    accountName: {
        fontSize: 17,
        color: "#627692",
        marginTop: 8,
    },

    changeText: {
        fontSize: 18,
        fontWeight: "800",
        color: "#079B8F",
    },

    /* SECTION LABEL */
    sectionLabel: {
        color: "#627692",
        fontSize: 17,
        fontWeight: "800",
        letterSpacing: 1,
        marginTop: 34,
        marginBottom: 22,
    },

    /* QUICK AMOUNTS */
    quickAmountsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },

    quickAmountButton: {
        flex: 1,
        minHeight: 74,
        borderWidth: 3,
        borderColor: "#E1E8F1",
        backgroundColor: "#F9FBFD",
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
    },

    quickAmountSelected: {
        borderColor: "#079B8F",
        backgroundColor: "#EFFBF9",
    },

    quickAmountDisabled: {
        opacity: 0.45,
    },

    quickAmountText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#34445F",
    },

    quickAmountSelectedText: {
        color: "#079B8F",
    },

    quickAmountDisabledText: {
        color: "#91A5C2",
    },

    /* AMOUNT INPUT */
    inputContainer: {
        height: 104,
        borderWidth: 3,
        borderColor: "#E1E8F1",
        backgroundColor: "#F9FBFD",
        borderRadius: 24,
        justifyContent: "center",
        paddingHorizontal: 24,
        marginTop: 34,
    },

    inputError: {
        borderColor: "#FCA5A5",
    },

    amountInput: {
        fontSize: 27,
        fontWeight: "700",
        color: "#17233D",
    },

    /* AVAILABLE BALANCE */
    balanceInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },

    availableText: {
        fontSize: 17,
        color: "#91A5C2",
        marginLeft: 8,
    },

    availableAmount: {
        color: "#34445F",
        fontWeight: "800",
    },

    errorText: {
        color: "#DC2626",
        fontSize: 14,
        marginTop: 8,
    },

    /* WITHDRAW BUTTON */
    withdrawButton: {
        height: 80,
        borderRadius: 30,
        backgroundColor: "#079B8F",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 34,
        paddingHorizontal: 12,
    },

    withdrawButtonDisabled: {
        backgroundColor: "#E0E7F0",
    },

    withdrawButtonText: {
        color: "#FFFFFF",
        fontSize: 19,
        fontWeight: "800",
    },

    withdrawButtonTextDisabled: {
        color: "#91A5C2",
    },

    processingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
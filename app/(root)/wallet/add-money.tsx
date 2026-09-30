import React, { useMemo, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type PaymentMethod = {
    id: string;
    title: string;
    subtitle: string;
    icon: IconName;
};

const quickAmounts = [5000, 10000, 20000, 50000];

const paymentMethods: PaymentMethod[] = [
    {
        id: "card",
        title: "Debit Card",
        subtitle: "Visa ••3821",
        icon: "card-outline",
    },
    {
        id: "bank",
        title: "Bank Transfer",
        subtitle: "GTBank · 0123456789",
        icon: "business-outline",
    },
    {
        id: "ussd",
        title: "USSD",
        subtitle: "Dial *737# to pay",
        icon: "phone-portrait-outline",
    },
];

const formatAmount = (value: number) => {
    return `₦${value.toLocaleString("en-NG")}`;
};

export default function AddMoneyScreen() {
    const router = useRouter();

    const [amount, setAmount] = useState("");
    const [selectedQuickAmount, setSelectedQuickAmount] = useState<
        number | null
    >(null);

    const [selectedMethod, setSelectedMethod] = useState("card");

    const [isProcessing, setIsProcessing] = useState(false);

    const numericAmount = useMemo(() => {
        const cleaned = amount.replace(/[^0-9]/g, "");
        return Number(cleaned) || 0;
    }, [amount]);

    const isAmountValid = numericAmount > 0;

    const handleQuickAmount = (value: number) => {
        setAmount(value.toString());
        setSelectedQuickAmount(value);
    };

    const handleAmountChange = (value: string) => {
        const cleaned = value.replace(/[^0-9]/g, "");

        setAmount(cleaned);

        const numericValue = Number(cleaned) || 0;

        setSelectedQuickAmount(
            quickAmounts.includes(numericValue) ? numericValue : null
        );
    };

    const saveWalletBalance = async (amountToAdd: number) => {
        try {
            const existingBalance = await AsyncStorage.getItem(
                "medicare_wallet_balance"
            );

            const currentBalance = existingBalance
                ? Number(existingBalance)
                : 0;

            const newBalance = currentBalance + amountToAdd;

            await AsyncStorage.setItem(
                "medicare_wallet_balance",
                newBalance.toString()
            );

            return newBalance;
        } catch (error) {
            console.log("Wallet balance error:", error);
            throw error;
        }
    };

    const saveTransaction = async (amountAdded: number) => {
        try {
            const existingTransactions =
                await AsyncStorage.getItem("medicare_wallet_transactions");

            const transactions = existingTransactions
                ? JSON.parse(existingTransactions)
                : [];

            const newTransaction = {
                id: Date.now().toString(),
                type: "deposit",
                amount: amountAdded,
                paymentMethod: selectedMethod,
                status: "completed",
                date: new Date().toISOString(),
            };

            const updatedTransactions = [
                newTransaction,
                ...transactions,
            ];

            await AsyncStorage.setItem(
                "medicare_wallet_transactions",
                JSON.stringify(updatedTransactions)
            );
        } catch (error) {
            console.log("Transaction error:", error);
        }
    };

    const handleAddMoney = async () => {
        if (!isAmountValid || isProcessing) return;

        setIsProcessing(true);

        try {
            /*
             * SIMULATED PAYMENT
             *
             * There is currently no backend/payment provider.
             * We wait for 1.5 seconds to make the experience
             * feel like a real payment process.
             */
            await new Promise((resolve) =>
                setTimeout(resolve, 1500)
            );

            await saveWalletBalance(numericAmount);

            await saveTransaction(numericAmount);

            setIsProcessing(false);

            Alert.alert(
                "Money Added Successfully",
                `${formatAmount(
                    numericAmount
                )} has been added to your wallet.`,
                [
                    {
                        text: "Done",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            setIsProcessing(false);

            Alert.alert(
                "Something went wrong",
                "We could not update your wallet. Please try again."
            );
        }
    };

    return (
        <View style={styles.overlay}>
            {/* BACKDROP */}
            <Pressable
                style={styles.backdrop}
                onPress={() => {
                    if (!isProcessing) {
                        router.back();
                    }
                }}
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
                                    Add money to wallet
                                </Text>

                                <Text style={styles.subtitle}>
                                    Funds appear instantly in your HealthPay
                                    balance.
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

                        {/* QUICK AMOUNTS */}
                        <Text style={styles.sectionLabel}>
                            QUICK AMOUNTS
                        </Text>

                        <View style={styles.quickAmountsRow}>
                            {quickAmounts.map((value) => {
                                const isSelected =
                                    selectedQuickAmount === value;

                                return (
                                    <TouchableOpacity
                                        key={value}
                                        activeOpacity={0.8}
                                        disabled={isProcessing}
                                        onPress={() =>
                                            handleQuickAmount(value)
                                        }
                                        style={[
                                            styles.quickAmountButton,
                                            isSelected &&
                                            styles.quickAmountSelected,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.quickAmountText,
                                                isSelected &&
                                                styles.quickAmountSelectedText,
                                            ]}
                                        >
                                            {formatAmount(value)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* CUSTOM AMOUNT */}
                        <View style={styles.inputContainer}>
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

                        {/* PAY WITH */}
                        <Text style={styles.sectionLabel}>
                            PAY WITH
                        </Text>

                        <View style={styles.paymentMethods}>
                            {paymentMethods.map((method) => {
                                const isSelected =
                                    selectedMethod === method.id;

                                return (
                                    <TouchableOpacity
                                        key={method.id}
                                        activeOpacity={0.8}
                                        disabled={isProcessing}
                                        onPress={() =>
                                            setSelectedMethod(method.id)
                                        }
                                        style={[
                                            styles.paymentCard,
                                            isSelected &&
                                            styles.paymentCardSelected,
                                        ]}
                                    >
                                        {/* METHOD ICON */}
                                        <View
                                            style={[
                                                styles.methodIconContainer,
                                                isSelected &&
                                                styles.methodIconSelected,
                                            ]}
                                        >
                                            <Ionicons
                                                name={method.icon}
                                                size={25}
                                                color={
                                                    isSelected
                                                        ? "#079B8F"
                                                        : "#627692"
                                                }
                                            />
                                        </View>

                                        {/* METHOD DETAILS */}
                                        <View style={styles.methodDetails}>
                                            <Text
                                                style={
                                                    styles.methodTitle
                                                }
                                            >
                                                {method.title}
                                            </Text>

                                            <Text
                                                style={
                                                    styles.methodSubtitle
                                                }
                                            >
                                                {method.subtitle}
                                            </Text>
                                        </View>

                                        {/* RADIO BUTTON */}
                                        <View
                                            style={[
                                                styles.radioOuter,
                                                isSelected &&
                                                styles.radioOuterSelected,
                                            ]}
                                        >
                                            {isSelected && (
                                                <View
                                                    style={
                                                        styles.radioInner
                                                    }
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* ADD MONEY BUTTON */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={
                                !isAmountValid || isProcessing
                            }
                            onPress={handleAddMoney}
                            style={[
                                styles.addButton,
                                (!isAmountValid || isProcessing) &&
                                styles.addButtonDisabled,
                            ]}
                        >
                            {isProcessing ? (
                                <View style={styles.processingContainer}>
                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />

                                    <Text
                                        style={[
                                            styles.addButtonText,
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
                                        styles.addButtonText,
                                        !isAmountValid &&
                                        styles.addButtonTextDisabled,
                                    ]}
                                >
                                    {isAmountValid
                                        ? `Add ${formatAmount(
                                            numericAmount
                                        )} to Wallet`
                                        : "Add Money to Wallet"}
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

    quickAmountText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#34445F",
    },

    quickAmountSelectedText: {
        color: "#079B8F",
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

    amountInput: {
        fontSize: 27,
        fontWeight: "700",
        color: "#17233D",
    },

    /* PAYMENT METHODS */
    paymentMethods: {
        gap: 16,
    },

    paymentCard: {
        minHeight: 126,
        borderWidth: 3,
        borderColor: "#E1E8F1",
        backgroundColor: "#F9FBFD",
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 18,
        flexDirection: "row",
        alignItems: "center",
    },

    paymentCardSelected: {
        borderColor: "#00CDBA",
        backgroundColor: "#F0FFFC",
    },

    methodIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F0F4F9",
    },

    methodIconSelected: {
        backgroundColor: "#E4FAF6",
    },

    methodDetails: {
        flex: 1,
        marginLeft: 16,
        marginRight: 10,
    },

    methodTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#17233D",
    },

    methodSubtitle: {
        fontSize: 16,
        color: "#627692",
        marginTop: 8,
    },

    /* RADIO */
    radioOuter: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 4,
        borderColor: "#CAD7E6",
        alignItems: "center",
        justifyContent: "center",
    },

    radioOuterSelected: {
        borderColor: "#079B8F",
    },

    radioInner: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#079B8F",
    },

    /* ADD BUTTON */
    addButton: {
        height: 80,
        borderRadius: 30,
        backgroundColor: "#079B8F",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 32,
        paddingHorizontal: 12,
    },

    addButtonDisabled: {
        backgroundColor: "#E0E7F0",
    },

    addButtonText: {
        color: "#FFFFFF",
        fontSize: 19,
        fontWeight: "800",
    },

    addButtonTextDisabled: {
        color: "#91A5C2",
    },

    processingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
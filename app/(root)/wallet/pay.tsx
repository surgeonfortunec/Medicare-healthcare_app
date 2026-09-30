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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { account } from "@/lib/appwrite";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const quickAmounts = [5000, 10000, 20000, 50000];

const AVAILABLE_BALANCE = 183000;

const formatAmount = (value: number) => {
    return `₦${value.toLocaleString("en-NG")}`;
};

export default function WithdrawScreen() {
    const router = useRouter();

    const [amount, setAmount] = useState("");
    const [selectedQuickAmount, setSelectedQuickAmount] =
        useState<number | null>(null);

    // Logged-in user name
    const [userName, setUserName] = useState("User");

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

    const numericAmount = useMemo(() => {
        const cleaned = amount.replace(/[^0-9]/g, "");
        return Number(cleaned) || 0;
    }, [amount]);

    const isAmountValid =
        numericAmount > 0 &&
        numericAmount <= AVAILABLE_BALANCE;

    const exceedsBalance =
        numericAmount > AVAILABLE_BALANCE;

    const handleQuickAmount = (value: number) => {
        setAmount(value.toString());
        setSelectedQuickAmount(value);
    };

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

    const handleWithdraw = () => {
        if (!isAmountValid) return;

        // TODO:
        // Connect to your backend withdrawal flow.
        // Validate the amount on the server as well.
        console.log({
            amount: numericAmount,
            userName,
            bank: "GTBank",
            accountLastFour: "7742",
        });
    };

    return (
        <View style={styles.overlay}>
            {/* BACKDROP */}
            <Pressable
                style={styles.backdrop}
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
                                onPress={() => router.back()}
                                style={styles.closeButton}
                                activeOpacity={0.8}
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
                                onPress={() => {
                                    // TODO:
                                    // Open bank account selection.
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

                                return (
                                    <TouchableOpacity
                                        key={value}
                                        activeOpacity={0.8}
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
                                        AVAILABLE_BALANCE
                                    )}
                                </Text>
                            </Text>
                        </View>

                        {exceedsBalance && (
                            <Text style={styles.errorText}>
                                Amount exceeds your available balance.
                            </Text>
                        )}

                        {/* WITHDRAW BUTTON */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={!isAmountValid}
                            onPress={handleWithdraw}
                            style={[
                                styles.withdrawButton,
                                !isAmountValid &&
                                styles.withdrawButtonDisabled,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.withdrawButtonText,
                                    !isAmountValid &&
                                    styles.withdrawButtonTextDisabled,
                                ]}
                            >
                                {`Withdraw ${formatAmount(
                                    numericAmount
                                )}`}
                            </Text>
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
});
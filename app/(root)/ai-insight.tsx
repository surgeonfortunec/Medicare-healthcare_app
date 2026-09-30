import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type Message = {
    id: string;
    text: string;
    sender: "ai" | "user";
    time: string;
};

const suggestions = [
    {
        icon: "bar-chart" as IconName,
        text: "Explain my last results",
    },
    {
        icon: "medkit" as IconName,
        text: "Medication interaction",
    },
    {
        icon: "water" as IconName,
        text: "Blood sugar",
    },
    {
        icon: "heart" as IconName,
        text: "Heart health",
    },
];

const initialMessages: Message[] = [
    {
        id: "1",
        sender: "ai",
        text:
            "Hi Fortune! 👋 I'm your AI health assistant. I can help you understand your results, explain medical terms, give general wellness tips, or remind you about your medication. How can I help you today?",
        time: "9:41 AM",
    },
];

const AIHealthInsight = () => {
    const router = useRouter();

    const [input, setInput] = useState("");
    const [messages, setMessages] =
        useState<Message[]>(initialMessages);

    const [isTyping, setIsTyping] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    /*
     * ---------------------------------------------------------
     * SIMPLE HEALTH CONVERSATION ENGINE
     * ---------------------------------------------------------
     *
     * This makes the current prototype feel conversational.
     *
     * Later, this function can be replaced with your backend
     * AI API without changing the UI.
     */

    const generateHealthResponse = (question: string) => {
        const lowerQuestion = question.toLowerCase();

        /*
         * BLOOD PRESSURE
         */
        if (
            lowerQuestion.includes("blood pressure") ||
            lowerQuestion.includes(" bp ") ||
            lowerQuestion.startsWith("bp") ||
            lowerQuestion.includes("pressure")
        ) {
            if (
                lowerQuestion.includes("high") ||
                lowerQuestion.includes("elevated")
            ) {
                return (
                    "I understand. If your blood pressure reading is higher than usual, the first thing I'd want to know is the actual reading and whether you were resting for about 5 minutes before checking it. 🩺\n\n" +
                    "One high reading does not necessarily mean you have hypertension. Things like stress, caffeine, exercise, pain, or taking the measurement incorrectly can temporarily increase it.\n\n" +
                    "What was your most recent blood pressure reading?"
                );
            }

            if (
                lowerQuestion.includes("low") ||
                lowerQuestion.includes("hypotension")
            ) {
                return (
                    "Low blood pressure can be completely normal for some people, but it matters more if you're experiencing symptoms such as dizziness, fainting, unusual weakness, or blurred vision.\n\n" +
                    "What was the actual blood pressure reading, and are you having any symptoms right now?"
                );
            }

            return (
                "Sure, let's talk about your blood pressure. ❤️\n\n" +
                "I can help you understand what a reading means, whether it is within a commonly used range, and what factors can affect it.\n\n" +
                "What was your latest BP reading?"
            );
        }

        /*
         * BLOOD SUGAR / GLUCOSE
         */
        if (
            lowerQuestion.includes("blood sugar") ||
            lowerQuestion.includes("blood glucose") ||
            lowerQuestion.includes("glucose") ||
            lowerQuestion.includes("sugar level")
        ) {
            if (
                lowerQuestion.includes("high") ||
                lowerQuestion.includes("elevated")
            ) {
                return (
                    "Let's look at it together. 🩸\n\n" +
                    "The meaning of a blood sugar result depends on whether the test was fasting, after eating, or taken at another time of day.\n\n" +
                    "If you give me the number, the unit (for example mg/dL or mmol/L), and whether you were fasting, I can explain what the result generally means.\n\n" +
                    "What was your reading?"
                );
            }

            return (
                "Of course. 🩸 Blood sugar results can mean different things depending on when the measurement was taken.\n\n" +
                "Was your reading taken while fasting, before a meal, or after eating? And what was the number?"
            );
        }

        /*
         * CHOLESTEROL
         */
        if (
            lowerQuestion.includes("cholesterol") ||
            lowerQuestion.includes("lipid") ||
            lowerQuestion.includes("ldl") ||
            lowerQuestion.includes("hdl") ||
            lowerQuestion.includes("triglyceride")
        ) {
            return (
                "I can help you understand your cholesterol results. 🧪\n\n" +
                "A cholesterol test is usually interpreted by looking at several numbers together, including LDL, HDL, total cholesterol and triglycerides.\n\n" +
                "If you have your results, send me the numbers and I can explain what each one represents in simple terms.\n\n" +
                "Do you have your cholesterol report with you?"
            );
        }

        /*
         * WEIGHT
         */
        if (
            lowerQuestion.includes("weight") ||
            lowerQuestion.includes("lose weight") ||
            lowerQuestion.includes("gain weight") ||
            lowerQuestion.includes("bmi")
        ) {
            return (
                "Absolutely. ⚖️ I can help you look at your weight in context rather than judging it from one number alone.\n\n" +
                "Things such as height, age, activity level, diet, medications and overall health can all matter.\n\n" +
                "If you'd like, tell me your height and current weight and I can help you understand your BMI and discuss general healthy-weight considerations."
            );
        }

        /*
         * MEDICATION
         */
        if (
            lowerQuestion.includes("medication") ||
            lowerQuestion.includes("medicine") ||
            lowerQuestion.includes("drug") ||
            lowerQuestion.includes("tablet") ||
            lowerQuestion.includes("pill") ||
            lowerQuestion.includes("interaction")
        ) {
            return (
                "I can help you understand medication information. 💊\n\n" +
                "For medication interactions, I need the exact names of the medicines or supplements you're taking. Some combinations can interact with each other, food, alcohol, or certain health conditions.\n\n" +
                "Tell me the medication names and doses if you know them, and I'll explain what is generally known about them.\n\n" +
                "If you're having a serious reaction such as difficulty breathing, swelling of the face or throat, severe confusion, or fainting, please seek urgent medical care rather than waiting for a chat response."
            );
        }

        /*
         * HEART HEALTH
         */
        if (
            lowerQuestion.includes("heart") ||
            lowerQuestion.includes("chest pain") ||
            lowerQuestion.includes("palpitation") ||
            lowerQuestion.includes("heartbeat")
        ) {
            if (
                lowerQuestion.includes("chest pain") ||
                lowerQuestion.includes("chest pressure") ||
                lowerQuestion.includes("difficulty breathing") ||
                lowerQuestion.includes("can't breathe")
            ) {
                return (
                    "Chest pain or pressure, especially with difficulty breathing, fainting, severe sweating, or pain spreading to the arm, back, neck or jaw can be an emergency. ❤️\n\n" +
                    "Please seek urgent medical attention now rather than relying on an AI chat to assess those symptoms.\n\n" +
                    "If you're currently experiencing severe or worsening symptoms, contact your local emergency service or go to the nearest emergency department."
                );
            }

            return (
                "Let's talk about your heart health. ❤️\n\n" +
                "I can explain things like heart rate, blood pressure, cholesterol, lifestyle factors and common cardiovascular risk factors.\n\n" +
                "Are you asking about a test result, a symptom, or ways to keep your heart healthy?"
            );
        }

        /*
         * TEST RESULTS
         */
        if (
            lowerQuestion.includes("result") ||
            lowerQuestion.includes("report") ||
            lowerQuestion.includes("lab") ||
            lowerQuestion.includes("test")
        ) {
            return (
                "Sure. I can help you understand a medical test in simple language. 📊\n\n" +
                "Send me the test name and the result you received. If there is a reference range on the report, include that too because reference ranges can vary between laboratories.\n\n" +
                "I'll explain what the result generally means and what questions you may want to discuss with your healthcare provider."
            );
        }

        /*
         * SYMPTOMS
         */
        if (
            lowerQuestion.includes("symptom") ||
            lowerQuestion.includes("pain") ||
            lowerQuestion.includes("dizzy") ||
            lowerQuestion.includes("dizziness") ||
            lowerQuestion.includes("fever") ||
            lowerQuestion.includes("headache") ||
            lowerQuestion.includes("tired")
        ) {
            return (
                "I'm listening. Tell me a little more about what you're experiencing. 🩺\n\n" +
                "When did it start? How severe is it? Has it been getting better or worse? And are you experiencing any other symptoms at the same time?\n\n" +
                "I can help you organize the information and explain possible general causes, but a healthcare professional should make a diagnosis."
            );
        }

        /*
         * GENERAL WELLNESS
         */
        if (
            lowerQuestion.includes("exercise") ||
            lowerQuestion.includes("workout") ||
            lowerQuestion.includes("diet") ||
            lowerQuestion.includes("healthy") ||
            lowerQuestion.includes("wellness") ||
            lowerQuestion.includes("sleep")
        ) {
            return (
                "That's a good area to focus on. 🌿\n\n" +
                "For general health, regular physical activity, a balanced diet, adequate sleep, stress management and avoiding tobacco are commonly recommended foundations.\n\n" +
                "If you tell me what you're trying to improve — for example blood pressure, blood sugar, weight, cholesterol, sleep or fitness — I can make the advice more specific."
            );
        }

        /*
         * GREETING
         */
        if (
            lowerQuestion === "hi" ||
            lowerQuestion === "hello" ||
            lowerQuestion.includes("good morning") ||
            lowerQuestion.includes("good afternoon") ||
            lowerQuestion.includes("good evening")
        ) {
            return (
                "Hello! 👋 I'm here with you. What would you like to talk about today — your results, medication, blood pressure, blood sugar, weight, cholesterol, symptoms, or general health?"
            );
        }

        /*
         * THANK YOU
         */
        if (
            lowerQuestion.includes("thank you") ||
            lowerQuestion.includes("thanks")
        ) {
            return (
                "You're very welcome! 😊 I'm happy to help you understand the information. If you have another result, symptom, medication or health question, just send it here."
            );
        }

        /*
         * DEFAULT CONVERSATIONAL RESPONSE
         */
        return (
            "I understand. Tell me a little more so I can help you properly. 🩺\n\n" +
            "For example, you can tell me:\n\n" +
            "• what you're experiencing\n" +
            "• your latest test result\n" +
            "• a medication you're taking\n" +
            "• your blood pressure or blood sugar reading\n" +
            "• or what aspect of your health you're concerned about.\n\n" +
            "What would you like us to look at first?"
        );
    };

    /*
     * ---------------------------------------------------------
     * SEND MESSAGE
     * ---------------------------------------------------------
     */

    const sendMessage = (messageText?: string) => {
        const text = (messageText ?? input).trim();

        if (!text || isTyping) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: "user",
            text,
            time: getCurrentTime(),
        };

        setMessages((previous) => [
            ...previous,
            userMessage,
        ]);

        setInput("");
        Keyboard.dismiss();

        setIsTyping(true);

        /*
         * Small delay so the conversation feels natural.
         */
        setTimeout(() => {
            const aiMessage: Message = {
                id: `${Date.now()}-ai`,
                sender: "ai",
                text: generateHealthResponse(text),
                time: getCurrentTime(),
            };

            setMessages((previous) => [
                ...previous,
                aiMessage,
            ]);

            setIsTyping(false);
        }, 900);
    };

    return (
        <SafeAreaView
            edges={["top", "bottom"]}
            className="flex-1 bg-white"
        >
            <KeyboardAvoidingView
                className="flex-1"
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                {/* HEADER */}
                <View className="bg-[#6437E8]">
                    <View className="flex-row items-center justify-between px-5 py-5">
                        {/* BACK BUTTON */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            activeOpacity={0.8}
                            className="h-12 w-12 items-center justify-center rounded-full bg-white/20"
                        >
                            <Ionicons
                                name="chevron-back"
                                size={28}
                                color="white"
                            />
                        </TouchableOpacity>

                        {/* TITLE */}
                        <View className="flex-1 px-4">
                            <Text className="text-[24px] font-bold text-white">
                                AI Health Assistant
                            </Text>

                            <Text className="mt-1 text-[15px] text-[#D9CEFF]">
                                Powered by HealthPass AI · Not medical advice
                            </Text>
                        </View>

                        {/* AI AVATAR */}
                        <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
                            <Text className="text-[25px]">
                                🤖
                            </Text>
                        </View>
                    </View>
                </View>

                {/* SUGGESTED QUESTIONS */}
                <View className="border-b border-[#E9EEF6] bg-[#F8FAFD] py-3">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                        }}
                    >
                        {suggestions.map((suggestion) => (
                            <TouchableOpacity
                                key={suggestion.text}
                                activeOpacity={0.8}
                                onPress={() =>
                                    sendMessage(suggestion.text)
                                }
                                className="mr-3 flex-row items-center rounded-full border-[2px] border-[#DCE5F8] bg-white px-5 py-3"
                            >
                                <Text className="mr-2 text-[16px]">
                                    {suggestion.icon === "bar-chart"
                                        ? "📊"
                                        : suggestion.icon === "medkit"
                                            ? "💊"
                                            : suggestion.icon === "water"
                                                ? "🩸"
                                                : "❤️"}
                                </Text>

                                <Text className="text-[15px] font-medium text-[#34445F]">
                                    {suggestion.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* CHAT AREA */}
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 28,
                        paddingBottom: 20,
                    }}
                    keyboardShouldPersistTaps="handled"
                    onContentSizeChange={() =>
                        scrollViewRef.current?.scrollToEnd({
                            animated: true,
                        })
                    }
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            className={`mb-5 flex-row ${
                                message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            {/* AI AVATAR */}
                            {message.sender === "ai" && (
                                <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#6537E8]">
                                    <Text className="text-[22px]">
                                        🤖
                                    </Text>
                                </View>
                            )}

                            <View
                                className={`max-w-[82%] ${
                                    message.sender === "ai"
                                        ? "items-start"
                                        : "items-end"
                                }`}
                            >
                                <View
                                    className={`rounded-[28px] px-5 py-5 ${
                                        message.sender === "ai"
                                            ? "rounded-tl-none bg-[#F0F4F9]"
                                            : "rounded-tr-none bg-[#6437E8]"
                                    }`}
                                >
                                    <Text
                                        className={`text-[18px] leading-8 ${
                                            message.sender === "ai"
                                                ? "text-[#24344F]"
                                                : "text-white"
                                        }`}
                                    >
                                        {message.text}
                                    </Text>
                                </View>

                                <Text className="mt-2 px-2 text-[13px] text-[#91A5C2]">
                                    {message.time}
                                </Text>
                            </View>
                        </View>
                    ))}

                    {/* TYPING INDICATOR */}
                    {isTyping && (
                        <View className="mb-5 flex-row justify-start">
                            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#6537E8]">
                                <Text className="text-[22px]">
                                    🤖
                                </Text>
                            </View>

                            <View className="items-start">
                                <View className="rounded-[28px] rounded-tl-none bg-[#F0F4F9] px-6 py-5">
                                    <Text className="text-[18px] tracking-[3px] text-[#91A5C2]">
                                        •••
                                    </Text>
                                </View>

                                <Text className="mt-2 px-2 text-[13px] text-[#91A5C2]">
                                    Thinking...
                                </Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* MEDICAL DISCLAIMER */}
                <View className="border-t border-[#F9E7A8] bg-[#FFFBEB] px-5 py-4">
                    <Text className="text-center text-[14px] leading-6 text-[#C96B13]">
                        ⚠️ For informational purposes only. Always consult a qualified healthcare provider.
                    </Text>
                </View>

                {/* MESSAGE INPUT */}
                <View className="border-t border-[#E9EEF6] bg-white px-4 py-4">
                    <View className="flex-row items-center">
                        <View className="flex-1 flex-row items-center rounded-[22px] border-[2px] border-[#DFE7F2] bg-[#F9FBFD] px-4">
                            <TextInput
                                value={input}
                                onChangeText={setInput}
                                placeholder="Ask a health question..."
                                placeholderTextColor="#91A5C2"
                                multiline
                                maxLength={1000}
                                className="max-h-[100px] min-h-[56px] flex-1 py-4 text-[16px] text-[#24344F]"
                                returnKeyType="send"
                                onSubmitEditing={() => sendMessage()}
                            />

                            {input.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setInput("")}
                                    className="ml-2"
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={21}
                                        color="#91A5C2"
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* SEND BUTTON */}
                        <TouchableOpacity
                            onPress={() => sendMessage()}
                            disabled={!input.trim() || isTyping}
                            activeOpacity={0.8}
                            className={`ml-3 h-16 w-16 items-center justify-center rounded-[22px] ${
                                input.trim() && !isTyping
                                    ? "bg-[#6437E8]"
                                    : "bg-[#D8CCFA]"
                            }`}
                        >
                            <Ionicons
                                name="paper-plane-outline"
                                size={26}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AIHealthInsight;
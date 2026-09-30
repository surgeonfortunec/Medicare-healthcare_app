
import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import images from "@/constants/images";

const { width, height } = Dimensions.get("window");

const ONBOARDING_COMPLETED_KEY = "medicare_onboarding_completed";

const onboardingData = [
    {
        id: "1",
        image: images.onBoarding1,
        title: "Quality care, closer than you think.",
        description:
            "Find, compare and book trusted healthcare services near you.",
    },
    {
        id: "2",
        image: images.onBoarding2,
        title: "Compare & Book With Ease",
        description:
            "Schedule appointments quickly at your convenience.",
    },
    {
        id: "3",
        image: images.onBoarding3,
        title: "Access Your Results anywhere, anytime.",
        description:
            "View your lab and radiology results, download reports and track your history.",
    },
];

export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const flatListRef = useRef<FlatList>(null);

    const isLastPage =
        currentIndex === onboardingData.length - 1;

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem(
                ONBOARDING_COMPLETED_KEY,
                "true"
            );

            router.replace("/auth/signup");
        } catch (error) {
            console.log(
                "ONBOARDING STORAGE ERROR:",
                error
            );

            // Even if storage fails, continue to signup.
            router.replace("/auth/signup");
        }
    };

    const handleSkip = () => {
        completeOnboarding();
    };

    const handleGetStarted = () => {
        completeOnboarding();
    };

    const handleScroll = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = Math.round(
            event.nativeEvent.contentOffset.x / width
        );

        setCurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            {/* Scrollable Onboarding Pages */}
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        {/* Image */}
                        <Image
                            source={item.image}
                            style={styles.image}
                            resizeMode="contain"
                        />

                        {/* Text */}
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>
                                {item.title}
                            </Text>

                            <Text style={styles.description}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                )}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {onboardingData.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index &&
                                styles.activeDot,
                        ]}
                    />
                ))}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                {!isLastPage ? (
                    <>
                        {/* Skip Button */}
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={handleSkip}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.skipText}>
                                Skip
                            </Text>
                        </TouchableOpacity>

                        {/* Next Button */}
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={handleNext}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.nextText}>
                                Next
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    /* Third Page */
                    <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={handleGetStarted}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.getStartedText}>
                            Get Started
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    slide: {
        width: width,
        alignItems: "center",
        paddingTop: height * 0.08,
    },

    image: {
        width: width * 0.85,
        height: height * 0.65,
    },

    textContainer: {
        width: width * 0.85,
        alignItems: "center",
        marginTop: 10,
    },

    title: {
        fontSize: 35,
        fontWeight: "700",
        color: "#12304A",
        textAlign: "center",
        marginBottom: 12,
    },

    description: {
        fontSize: 20,
        lineHeight: 23,
        color: "#526575",
        textAlign: "center",
    },

    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 35,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#D7E3EA",
        marginHorizontal: 5,
    },

    activeDot: {
        width: 22,
        backgroundColor: "#079B61",
    },

    buttonContainer: {
        flexDirection: "row",
        width: width * 0.85,
        alignSelf: "center",
        marginBottom: 55,
    },

    skipButton: {
        flex: 1,
        height: 54,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },

    skipText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#526575",
    },

    nextButton: {
        flex: 1,
        height: 54,
        borderRadius: 12,
        backgroundColor: "#079B61",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },

    nextText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    getStartedButton: {
        flex: 1,
        height: 54,
        borderRadius: 12,
        backgroundColor: "#079B61",
        justifyContent: "center",
        alignItems: "center",
    },

    getStartedText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
});


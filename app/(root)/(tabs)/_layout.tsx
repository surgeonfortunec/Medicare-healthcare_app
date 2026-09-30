import { Tabs } from "expo-router";
import React from "react";
import { View, Text, Image } from "react-native";
import icons from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";

const TabIcon = ({
                     focused,
                     icon,
                     title,
                 }: {
    focused: boolean;
    icon: any;
    title: string;
}) => (
    <View className="flex-1 mt-3 flex-col items-center justify-center">
        <Image
            source={icon}
            tintColor={focused ? "#009689" : "#8E8E93"}
            resizeMode="contain"
            className="size-6"
        />
        <Text
            className={`${
                focused
                    ? "text-primary-300 font-rubik-medium"
                    : "text-black-300 font-rubik-medium"
            } text-xs w-full text-center mt-1`}
            style={{ color: focused ? "#009689" : "#8E8E93" }}
        >
            {title}
        </Text>

        {focused && (
            <View
                style={{
                    height: 3,
                    width: 18,
                    backgroundColor: "#009689",
                    borderRadius: 2,
                    marginTop: 4,
                }}
            />
        )}
    </View>
);

// Elevated / raised floating icon for the center "Pay" tab
const FloatingTabIcon = ({ icon }: { icon: any }) => (
    <View
        style={{
            position: "absolute",
            top: -28,
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: "#009689",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#009689",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 10,
            elevation: 8,
        }}
    >
        <Image
            source={icon}
            tintColor="#FFFFFF"
            resizeMode="contain"
            style={{ width: 26, height: 26 }}
        />
    </View>
);

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "white",
                    position: "absolute",
                    borderTopColor: "#0061FF1A",
                    borderTopWidth: 1,
                    minHeight: 70,
                    overflow: "visible",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={icons.home} focused={focused} title="Home" />
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={icons.search} focused={focused} title="Explore" />
                    ),
                }}
            />

            <Tabs.Screen
                name="wallet"
                options={{
                    title: "",
                    headerShown: false,
                    tabBarIcon: () => <FloatingTabIcon icon={icons.wallet} />,
                    tabBarLabel: () => null,
                }}
            />

            <Tabs.Screen
                name="bookings"
                options={{
                    title: "Bookings",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={icons.bookings} focused={focused} title="Bookings" />
                    ),
                }}
            />

            <Tabs.Screen
                name="records"
                options={{
                    title: "Records",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={icons.records} focused={focused} title="Records" />
                    ),
                }}
            />


        </Tabs>
    );
}
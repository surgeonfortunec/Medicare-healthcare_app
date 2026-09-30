import React, {
    useCallback,
    useState,
} from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
    useFocusEffect,
    useLocalSearchParams,
    useRouter,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type IconName =
    React.ComponentProps<typeof Ionicons>["name"];

type AppointmentStatus =
    | "Confirmed"
    | "Pending"
    | "Completed"
    | "Cancelled";

type AppointmentType =
    | "Upcoming"
    | "Past";

type Appointment = {
    id: string;
    facility: string;
    service: string;
    date: string;
    time: string;
    status: AppointmentStatus;
    image: string;
    location: string;
    price: string;
    type: AppointmentType;
};

type FilterTab =
    | "Upcoming"
    | "Past"
    | "All";

const APPOINTMENTS_KEY =
    "medicare_appointments";

const statusStyles: Record<
    AppointmentStatus,
    {
        background: string;
        border: string;
        text: string;
    }
> = {
    Confirmed: {
        background: "#F0FFF6",
        border: "#B5F0CE",
        text: "#16A34A",
    },

    Pending: {
        background: "#FFFBEA",
        border: "#FDE68A",
        text: "#D97706",
    },

    Completed: {
        background: "#EFF6FF",
        border: "#BFDBFE",
        text: "#2563EB",
    },

    Cancelled: {
        background: "#FFF1F2",
        border: "#FECDD3",
        text: "#E11D48",
    },
};

const Appointments = () => {
    const router = useRouter();

    /*
     * Parameters coming from Home.
     *
     * When Home sends a new booking, these parameters
     * are used to create the appointment.
     */
    const params = useLocalSearchParams();

    const [selectedTab, setSelectedTab] =
        useState<FilterTab>("Upcoming");

    const [expandedId, setExpandedId] =
        useState<string | null>(null);

    const [appointments, setAppointments] =
        useState<Appointment[]>([]);

    const [loading, setLoading] =
        useState(true);

    /*
     * ---------------------------------------------------------
     * LOAD APPOINTMENTS
     * ---------------------------------------------------------
     */

    useFocusEffect(
        useCallback(() => {
            loadAppointments();
        }, [])
    );

    const loadAppointments = async () => {
        try {
            setLoading(true);

            const stored =
                await AsyncStorage.getItem(
                    APPOINTMENTS_KEY
                );

            let savedAppointments: Appointment[] =
                stored
                    ? JSON.parse(stored)
                    : [];

            /*
             * -------------------------------------------------
             * CHECK IF HOME SENT A NEW APPOINTMENT
             * -------------------------------------------------
             */

            if (
                params.facility &&
                params.service
            ) {
                const appointmentId =
                    params.appointmentId?.toString() ||
                    Date.now().toString();

                /*
                 * Prevent duplicate appointment
                 * when the screen refreshes.
                 */
                const alreadyExists =
                    savedAppointments.some(
                        (appointment) =>
                            appointment.id ===
                            appointmentId
                    );

                if (!alreadyExists) {
                    const newAppointment: Appointment =
                        {
                            id: appointmentId,

                            facility:
                                params.facility.toString(),

                            service:
                                params.service.toString(),

                            date:
                                params.date?.toString() ||
                                "Date to be confirmed",

                            time:
                                params.time?.toString() ||
                                "Time to be confirmed",

                            status: "Confirmed",

                            image:
                                params.image?.toString() ||
                                "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600",

                            location:
                                params.location?.toString() ||
                                "Abuja, Nigeria",

                            price:
                                params.price?.toString() ||
                                "Price to be confirmed",

                            type: "Upcoming",
                        };

                    savedAppointments = [
                        newAppointment,
                        ...savedAppointments,
                    ];

                    await AsyncStorage.setItem(
                        APPOINTMENTS_KEY,
                        JSON.stringify(
                            savedAppointments
                        )
                    );

                    /*
                     * Clear params after saving so
                     * the appointment is not added again.
                     */
                    router.setParams({
                        facility: undefined,
                        service: undefined,
                        appointmentId:
                        undefined,
                        date: undefined,
                        time: undefined,
                        image: undefined,
                        location: undefined,
                        price: undefined,
                    });
                }
            }

            /*
             * Newest appointments first.
             */
            savedAppointments.sort(
                (a, b) =>
                    Number(b.id) -
                    Number(a.id)
            );

            setAppointments(
                savedAppointments
            );
        } catch (error) {
            console.log(
                "Unable to load appointments:",
                error
            );

            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    /*
     * ---------------------------------------------------------
     * SAVE APPOINTMENTS
     * ---------------------------------------------------------
     */

    const saveAppointments = async (
        updatedAppointments: Appointment[]
    ) => {
        try {
            await AsyncStorage.setItem(
                APPOINTMENTS_KEY,
                JSON.stringify(
                    updatedAppointments
                )
            );

            setAppointments(
                updatedAppointments
            );
        } catch (error) {
            console.log(
                "Unable to save appointments:",
                error
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * CONFIRM APPOINTMENT
     *
     * Successful appointment becomes:
     *
     * Past → Completed
     * ---------------------------------------------------------
     */

    const handleConfirm = (
        appointment: Appointment
    ) => {
        Alert.alert(
            "Confirm appointment",
            `Was your ${appointment.service} appointment at ${appointment.facility} successful?`,
            [
                {
                    text: "Not yet",
                    style: "cancel",
                },

                {
                    text: "Yes, completed",
                    onPress: async () => {
                        const updated =
                            appointments.map(
                                (item) =>
                                    item.id ===
                                    appointment.id
                                        ? {
                                            ...item,
                                            status:
                                                "Completed",
                                            type:
                                                "Past",
                                        }
                                        : item
                            );

                        await saveAppointments(
                            updated
                        );

                        setExpandedId(null);

                        Alert.alert(
                            "Appointment completed",
                            "Your appointment has been moved to Past."
                        );
                    },
                },
            ]
        );
    };

    /*
     * ---------------------------------------------------------
     * CANCEL APPOINTMENT
     *
     * Upcoming → Past
     * Status → Cancelled
     * ---------------------------------------------------------
     */

    const handleCancel = (
        appointment: Appointment
    ) => {
        Alert.alert(
            "Cancel appointment",
            `Are you sure you want to cancel your ${appointment.service} appointment?`,
            [
                {
                    text: "Keep appointment",
                    style: "cancel",
                },

                {
                    text: "Cancel appointment",
                    style: "destructive",
                    onPress: async () => {
                        const updated =
                            appointments.map(
                                (item) =>
                                    item.id ===
                                    appointment.id
                                        ? {
                                            ...item,
                                            status:
                                                "Cancelled",
                                            type:
                                                "Past",
                                        }
                                        : item
                            );

                        await saveAppointments(
                            updated
                        );

                        setExpandedId(null);

                        Alert.alert(
                            "Appointment cancelled",
                            "The appointment has been moved to Past."
                        );
                    },
                },
            ]
        );
    };

    /*
     * ---------------------------------------------------------
     * FILTER APPOINTMENTS
     * ---------------------------------------------------------
     */

    const filteredAppointments =
        appointments.filter(
            (appointment) => {
                if (
                    selectedTab ===
                    "Upcoming"
                ) {
                    return (
                        appointment.type ===
                        "Upcoming"
                    );
                }

                if (
                    selectedTab ===
                    "Past"
                ) {
                    return (
                        appointment.type ===
                        "Past"
                    );
                }

                /*
                 * ALL
                 *
                 * Shows both upcoming and past.
                 */
                return true;
            }
        );

    /*
     * ---------------------------------------------------------
     * STATISTICS
     * ---------------------------------------------------------
     */

    const upcomingCount =
        appointments.filter(
            (appointment) =>
                appointment.type ===
                "Upcoming"
        ).length;

    const completedCount =
        appointments.filter(
            (appointment) =>
                appointment.status ===
                "Completed"
        ).length;

    const cancelledCount =
        appointments.filter(
            (appointment) =>
                appointment.status ===
                "Cancelled"
        ).length;

    /*
     * ---------------------------------------------------------
     * BOOK NOW
     * ---------------------------------------------------------
     */

    const handleBookNow = () => {
        router.push(
            "/(root)/(tabs)/explore"
        );
    };

    /*
     * ---------------------------------------------------------
     * FORMAT EMPTY STATE
     * ---------------------------------------------------------
     */

    const getEmptyMessage = () => {
        if (
            selectedTab ===
            "Upcoming"
        ) {
            return {
                title:
                    "No upcoming appointments",
                text:
                    "Book a healthcare service and your appointment will appear here.",
            };
        }

        if (
            selectedTab ===
            "Past"
        ) {
            return {
                title:
                    "No past appointments",
                text:
                    "Completed and cancelled appointments will appear here.",
            };
        }

        return {
            title:
                "No appointments yet",
            text:
                "Your upcoming and past appointments will appear here.",
        };
    };

    return (
        <SafeAreaView
            className="flex-1 bg-white"
            edges={["top"]}
        >
            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    paddingBottom: 32,
                }}
            >
                {/* ================= HEADER ================= */}

                <View className="px-6 pt-8">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-[32px] font-bold tracking-[-1px] text-[#17233D]">
                            Appointments
                        </Text>

                        <TouchableOpacity
                            activeOpacity={
                                0.85
                            }
                            onPress={
                                handleBookNow
                            }
                            className="flex-row items-center rounded-[24px] bg-[#079B8F] px-5 py-4"
                        >
                            <Ionicons
                                name="arrow-forward"
                                size={22}
                                color="#FFFFFF"
                            />

                            <Text className="ml-3 text-[16px] font-bold text-white">
                                Book new
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ================= STATISTICS ================= */}

                <View className="mt-8 flex-row px-5">
                    {/* UPCOMING */}

                    <View className="mr-3 flex-1 items-center justify-center rounded-[24px] bg-[#F0FFFC] py-5">
                        <Text className="text-[38px] font-bold text-[#079B8F]">
                            {
                                upcomingCount
                            }
                        </Text>

                        <Text className="mt-1 text-[16px] font-semibold text-[#657C9D]">
                            Upcoming
                        </Text>
                    </View>

                    {/* COMPLETED */}

                    <View className="mr-3 flex-1 items-center justify-center rounded-[24px] bg-[#F0FFF4] py-5">
                        <Text className="text-[38px] font-bold text-[#16A34A]">
                            {
                                completedCount
                            }
                        </Text>

                        <Text className="mt-1 text-[16px] font-semibold text-[#657C9D]">
                            Completed
                        </Text>
                    </View>

                    {/* CANCELLED */}

                    <View className="flex-1 items-center justify-center rounded-[24px] bg-[#FFF2F2] py-5">
                        <Text className="text-[38px] font-bold text-[#EF4444]">
                            {
                                cancelledCount
                            }
                        </Text>

                        <Text className="mt-1 text-[16px] font-semibold text-[#657C9D]">
                            Cancelled
                        </Text>
                    </View>
                </View>

                {/* ================= FILTER TABS ================= */}

                <View className="mx-6 mt-8 flex-row rounded-[24px] bg-[#F0F4F9] p-1.5">
                    {(
                        [
                            "Upcoming",
                            "Past",
                            "All",
                        ] as FilterTab[]
                    ).map(
                        (tab) => {
                            const isSelected =
                                selectedTab ===
                                tab;

                            return (
                                <TouchableOpacity
                                    key={
                                        tab
                                    }
                                    activeOpacity={
                                        0.8
                                    }
                                    onPress={() => {
                                        setSelectedTab(
                                            tab
                                        );
                                        setExpandedId(
                                            null
                                        );
                                    }}
                                    className={`flex-1 items-center justify-center rounded-[18px] py-4 ${
                                        isSelected
                                            ? "bg-white"
                                            : "bg-transparent"
                                    }`}
                                    style={
                                        isSelected
                                            ? {
                                                shadowColor:
                                                    "#64748B",
                                                shadowOffset:
                                                    {
                                                        width: 0,
                                                        height: 2,
                                                    },
                                                shadowOpacity:
                                                    0.12,
                                                shadowRadius:
                                                    4,
                                                elevation: 3,
                                            }
                                            : undefined
                                    }
                                >
                                    <Text
                                        className={`text-[17px] font-bold ${
                                            isSelected
                                                ? "text-[#17233D]"
                                                : "text-[#657C9D]"
                                        }`}
                                    >
                                        {
                                            tab
                                        }
                                    </Text>
                                </TouchableOpacity>
                            );
                        }
                    )}
                </View>

                {/* ================= DIVIDER ================= */}

                <View className="mt-5 h-[3px] bg-[#F0F4F9]" />

                {/* ================= APPOINTMENT CARDS ================= */}

                <View className="px-6 pt-6">
                    {loading ? (
                        <View className="items-center py-16">
                            <Text className="text-[16px] font-semibold text-[#657C9D]">
                                Loading appointments...
                            </Text>
                        </View>
                    ) : filteredAppointments.length ===
                    0 ? (
                        <View className="items-center rounded-[24px] bg-[#F7FAFC] px-5 py-12">
                            <Ionicons
                                name="calendar-outline"
                                size={48}
                                color="#91A5C2"
                            />

                            <Text className="mt-4 text-center text-[17px] font-bold text-[#17233D]">
                                {
                                    getEmptyMessage()
                                        .title
                                }
                            </Text>

                            <Text className="mt-2 text-center text-[14px] text-[#657C9D]">
                                {
                                    getEmptyMessage()
                                        .text
                                }
                            </Text>

                            {selectedTab !==
                                "Past" && (
                                    <TouchableOpacity
                                        onPress={
                                            handleBookNow
                                        }
                                        className="mt-5 rounded-2xl bg-[#079B8F] px-6 py-4"
                                    >
                                        <Text className="font-bold text-white">
                                            Book an appointment
                                        </Text>
                                    </TouchableOpacity>
                                )}
                        </View>
                    ) : (
                        filteredAppointments.map(
                            (
                                appointment
                            ) => {
                                const isExpanded =
                                    expandedId ===
                                    appointment.id;

                                const style =
                                    statusStyles[
                                        appointment
                                            .status
                                        ];

                                const isUpcoming =
                                    appointment.type ===
                                    "Upcoming";

                                return (
                                    <View
                                        key={
                                            appointment.id
                                        }
                                        className="mb-6 overflow-hidden rounded-[28px] border-[2px] border-[#F0F4F9] bg-white"
                                        style={{
                                            shadowColor:
                                                "#9AA8BA",
                                            shadowOffset:
                                                {
                                                    width: 0,
                                                    height: 3,
                                                },
                                            shadowOpacity:
                                                0.12,
                                            shadowRadius:
                                                7,
                                            elevation: 3,
                                        }}
                                    >
                                        {/* MAIN CARD */}

                                        <TouchableOpacity
                                            activeOpacity={
                                                0.85
                                            }
                                            onPress={() =>
                                                setExpandedId(
                                                    isExpanded
                                                        ? null
                                                        : appointment.id
                                                )
                                            }
                                            className="p-5"
                                        >
                                            <View className="flex-row items-start">
                                                {/* IMAGE */}

                                                <Image
                                                    source={{
                                                        uri: appointment.image,
                                                    }}
                                                    resizeMode="cover"
                                                    className="h-[106px] w-[106px] rounded-[22px]"
                                                />

                                                {/* DETAILS */}

                                                <View className="ml-5 flex-1">
                                                    <Text
                                                        numberOfLines={
                                                            2
                                                        }
                                                        className="pr-2 text-[19px] font-bold leading-7 text-[#17233D]"
                                                    >
                                                        {
                                                            appointment.facility
                                                        }
                                                    </Text>

                                                    {/* STATUS */}

                                                    <View
                                                        style={{
                                                            alignSelf:
                                                                "flex-start",
                                                            backgroundColor:
                                                            style.background,
                                                            borderColor:
                                                            style.border,
                                                        }}
                                                        className="mt-2 rounded-full border-[2px] px-3 py-1.5"
                                                    >
                                                        <Text
                                                            style={{
                                                                color:
                                                                style.text,
                                                            }}
                                                            className="text-[14px] font-bold"
                                                        >
                                                            {
                                                                appointment.status
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>

                                            {/* SERVICE */}

                                            <Text className="mt-4 text-[18px] text-[#657C9D]">
                                                {
                                                    appointment.service
                                                }
                                            </Text>

                                            {/* DATE */}

                                            <View className="mt-4 flex-row items-center">
                                                <Ionicons
                                                    name="calendar-outline"
                                                    size={18}
                                                    color="#079B8F"
                                                />

                                                <Text className="ml-2 text-[16px] font-bold text-[#34445F]">
                                                    {
                                                        appointment.date
                                                    }
                                                </Text>

                                                <Ionicons
                                                    name="time-outline"
                                                    size={18}
                                                    color="#657C9D"
                                                    style={{
                                                        marginLeft: 14,
                                                    }}
                                                />

                                                <Text className="ml-2 text-[16px] text-[#657C9D]">
                                                    {
                                                        appointment.time
                                                    }
                                                </Text>
                                            </View>

                                            {/* CHEVRON */}

                                            <View className="absolute bottom-6 right-5">
                                                <Ionicons
                                                    name={
                                                        isExpanded
                                                            ? "chevron-up"
                                                            : "chevron-down"
                                                    }
                                                    size={22}
                                                    color="#91A5C2"
                                                />
                                            </View>
                                        </TouchableOpacity>

                                        {/* EXPANDED DETAILS */}

                                        {isExpanded && (
                                            <View className="border-t-[2px] border-[#F0F4F9] px-5 pb-5 pt-4">
                                                {/* LOCATION */}

                                                <View className="flex-row justify-between">
                                                    <Text className="text-[15px] text-[#657C9D]">
                                                        Location
                                                    </Text>

                                                    <Text className="text-right text-[15px] font-semibold text-[#34445F]">
                                                        {
                                                            appointment.location
                                                        }
                                                    </Text>
                                                </View>

                                                {/* AMOUNT */}

                                                <View className="mt-3 flex-row justify-between">
                                                    <Text className="text-[15px] text-[#657C9D]">
                                                        Amount
                                                    </Text>

                                                    <Text className="text-[15px] font-bold text-[#078F84]">
                                                        {
                                                            appointment.price
                                                        }
                                                    </Text>
                                                </View>

                                                {/* UPCOMING ACTIONS */}

                                                {isUpcoming && (
                                                    <View className="mt-5 flex-row">
                                                        {/* CONFIRM */}

                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                handleConfirm(
                                                                    appointment
                                                                )
                                                            }
                                                            activeOpacity={
                                                                0.85
                                                            }
                                                            className="mr-3 flex-1 items-center rounded-2xl bg-[#079B8F] py-4"
                                                        >
                                                            <Text className="font-bold text-white">
                                                                Confirm
                                                            </Text>
                                                        </TouchableOpacity>

                                                        {/* CANCEL */}

                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                handleCancel(
                                                                    appointment
                                                                )
                                                            }
                                                            activeOpacity={
                                                                0.85
                                                            }
                                                            className="flex-1 items-center rounded-2xl border-[2px] border-[#FECDD3] bg-[#FFF1F2] py-4"
                                                        >
                                                            <Text className="font-bold text-[#E11D48]">
                                                                Cancel
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}

                                                {/* PAST APPOINTMENT */}

                                                {!isUpcoming && (
                                                    <View
                                                        style={{
                                                            backgroundColor:
                                                            style.background,
                                                            borderColor:
                                                            style.border,
                                                        }}
                                                        className="mt-5 rounded-2xl border-[2px] p-4"
                                                    >
                                                        <View className="flex-row items-center">
                                                            <Ionicons
                                                                name={
                                                                    appointment.status ===
                                                                    "Completed"
                                                                        ? "checkmark-circle"
                                                                        : "close-circle"
                                                                }
                                                                size={
                                                                    22
                                                                }
                                                                color={
                                                                    style.text
                                                                }
                                                            />

                                                            <Text
                                                                style={{
                                                                    color:
                                                                    style.text,
                                                                }}
                                                                className="ml-2 flex-1 text-[15px] font-bold"
                                                            >
                                                                {appointment.status ===
                                                                "Completed"
                                                                    ? "Appointment completed successfully"
                                                                    : "Appointment was cancelled"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                );
                            }
                        )
                    )}
                </View>

                {/* ================= READY TO BOOK CTA ================= */}

                <View className="mx-6 mt-2 overflow-hidden rounded-[28px] bg-[#079B8F]">
                    <View className="flex-row items-center p-6">
                        {/* ICON */}

                        <View className="h-[90px] w-[90px] items-center justify-center rounded-[22px] bg-[#42B9AF]">
                            <Ionicons
                                name="calendar-outline"
                                size={44}
                                color="#FFFFFF"
                            />

                            <View className="absolute bottom-5 right-5">
                                <Ionicons
                                    name="add"
                                    size={15}
                                    color="#FFFFFF"
                                />
                            </View>
                        </View>

                        {/* TEXT */}

                        <View className="ml-5 flex-1">
                            <Text className="text-[21px] font-bold text-white">
                                Ready to book?
                            </Text>

                            <Text className="mt-2 text-[17px] leading-7 text-[#B8F4ED]">
                                Search for a test or scan to get started
                            </Text>
                        </View>
                    </View>

                    {/* BUTTON */}

                    <View className="px-6 pb-6">
                        <TouchableOpacity
                            onPress={
                                handleBookNow
                            }
                            activeOpacity={
                                0.85
                            }
                            className="items-center rounded-[22px] bg-white py-4"
                        >
                            <Text className="text-[18px] font-bold text-[#078F84]">
                                Book now
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Appointments;
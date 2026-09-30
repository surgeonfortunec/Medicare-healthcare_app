import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    Modal,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type VitalCard = {
    id: string;
    title: string;
    value: string;
    unit: string;
    icon: string;
    color: string;
    background: string;
};

type HistoryItem = {
    id: string;
    value: string;
    unit: string;
    date: string;
    status: "High" | "Normal";
};

type Medication = {
    id: string;
    name: string;
    schedule: string;
};

type Reminder = {
    id: string;
    icon: string;
    iconBg: string;
    title: string;
    time: string;
    enabled: boolean;
};

const filterItems = [
    {
        id: "bp",
        label: "BP",
        icon: "❤️",
    },
    {
        id: "sugar",
        label: "Sugar",
        icon: "🩸",
    },
    {
        id: "weight",
        label: "Weight",
        icon: "⚖️",
    },
    {
        id: "cholesterol",
        label: "Chol.",
        icon: "🧪",
    },
    {
        id: "meds",
        label: "Meds",
        icon: "💊",
    },
    {
        id: "alerts",
        label: "",
        icon: "🔔",
    },
];

/* ===================================================== */
/* NEW USER STARTS WITH EMPTY HISTORY */
/* ===================================================== */

const initialBpHistory: HistoryItem[] = [];

const initialSugarHistory: HistoryItem[] = [];

const initialWeightHistory: HistoryItem[] = [];

const initialCholesterolHistory: HistoryItem[] = [];

const initialMedications: Medication[] = [];

const initialReminders: Reminder[] = [];

const VitalSigns = () => {
    const router = useRouter();

    const [selectedVital, setSelectedVital] = useState("bp");

    /* ================================================= */
    /* HISTORY STATE */
    /* ================================================= */

    const [bpHistory, setBpHistory] =
        useState<HistoryItem[]>(initialBpHistory);

    const [sugarHistory, setSugarHistory] =
        useState<HistoryItem[]>(initialSugarHistory);

    const [weightHistory, setWeightHistory] =
        useState<HistoryItem[]>(initialWeightHistory);

    const [cholesterolHistory, setCholesterolHistory] =
        useState<HistoryItem[]>(initialCholesterolHistory);

    /* ================================================= */
    /* MEDICATION STATE */
    /* ================================================= */

    const [medications, setMedications] =
        useState<Medication[]>(initialMedications);

    const [reminders, setReminders] =
        useState<Reminder[]>(initialReminders);

    /* ================================================= */
    /* BLOOD GROUP + GENOTYPE STATE */
    /* ================================================= */

    const [bloodGroup, setBloodGroup] = useState("O+");
    const [genotype, setGenotype] = useState("AS");

    const [editBloodInfoVisible, setEditBloodInfoVisible] =
        useState(false);

    const [editingBloodGroup, setEditingBloodGroup] =
        useState(bloodGroup);

    const [editingGenotype, setEditingGenotype] =
        useState(genotype);

    /* ================================================= */
    /* NEW RECORD BOTTOM SHEET STATE */
    /* ================================================= */

    const [recordModalVisible, setRecordModalVisible] =
        useState(false);

    const [recordType, setRecordType] = useState<
        "bp" | "sugar" | "weight" | "cholesterol" | "medication" | null
    >(null);

    /* ================================================= */
    /* NEW BP INPUTS */
    /* ================================================= */

    const [newSystolic, setNewSystolic] = useState("");
    const [newDiastolic, setNewDiastolic] = useState("");

    /* ================================================= */
    /* NEW SUGAR INPUT */
    /* ================================================= */

    const [newSugar, setNewSugar] = useState("");

    /* ================================================= */
    /* NEW WEIGHT INPUT */
    /* ================================================= */

    const [newWeight, setNewWeight] = useState("");

    /* ================================================= */
    /* NEW CHOLESTEROL INPUT */
    /* ================================================= */

    const [newCholesterol, setNewCholesterol] =
        useState("");

    /* ================================================= */
    /* NEW MEDICATION INPUTS */
    /* ================================================= */

    const [newMedicationName, setNewMedicationName] =
        useState("");

    const [newMedicationSchedule, setNewMedicationSchedule] =
        useState("");

    /* ================================================= */
    /* VITAL CARDS */
    /* ================================================= */

    const vitalCards: VitalCard[] = [
        {
            id: "bp",
            title: "Blood Pressure",
            value: bpHistory[0]?.value || "—",
            unit: "mmHg",
            icon: "❤️",
            color: "#E12D2D",
            background: "#FFF3F3",
        },
        {
            id: "sugar",
            title: "Blood Sugar",
            value: sugarHistory[0]?.value || "—",
            unit: "mg/dL",
            icon: "🩸",
            color: "#D62828",
            background: "#FFFFFF",
        },
        {
            id: "weight",
            title: "Weight",
            value: weightHistory[0]?.value || "—",
            unit: "kg",
            icon: "⚖️",
            color: "#16A34A",
            background: "#FFFFFF",
        },
        {
            id: "blood-group",
            title: "Blood Group",
            value: bloodGroup,
            unit: `Genotype: ${genotype}`,
            icon: "🩺",
            color: "#E12D2D",
            background: "#FFFFFF",
        },
    ];

    /* ================================================= */
    /* REMINDER TOGGLE */
    /* ================================================= */

    const toggleReminder = (id: string) => {
        setReminders((prev) =>
            prev.map((reminder) =>
                reminder.id === id
                    ? {
                        ...reminder,
                        enabled: !reminder.enabled,
                    }
                    : reminder
            )
        );
    };

    /* ================================================= */
    /* BLOOD GROUP EDITOR */
    /* ================================================= */

    const openBloodInfoEditor = () => {
        setEditingBloodGroup(bloodGroup);
        setEditingGenotype(genotype);
        setEditBloodInfoVisible(true);
    };

    const saveBloodInfo = () => {
        setBloodGroup(editingBloodGroup.trim().toUpperCase());
        setGenotype(editingGenotype.trim().toUpperCase());
        setEditBloodInfoVisible(false);
    };

    /* ================================================= */
    /* GET ACTUAL DATE + TIME */
    /* ================================================= */

    const getCurrentDateTime = () => {
        const now = new Date();

        const day = now.getDate();

        const month = now.toLocaleString("en-US", {
            month: "short",
        });

        const hour = now.toLocaleString("en-US", {
            hour: "numeric",
            hour12: true,
        });

        const minute = now
            .getMinutes()
            .toString()
            .padStart(2, "0");

        return `${day} ${month}, ${hour.split(":")[0]}:${minute} ${hour.includes("AM") ? "AM" : "PM"}`;
    };

    /* ================================================= */
    /* OPEN NEW RECORD MODAL */
    /* ================================================= */

    const openRecordModal = (
        type:
            | "bp"
            | "sugar"
            | "weight"
            | "cholesterol"
            | "medication"
    ) => {
        setRecordType(type);

        /* Clear previous inputs */

        setNewSystolic("");
        setNewDiastolic("");
        setNewSugar("");
        setNewWeight("");
        setNewCholesterol("");
        setNewMedicationName("");
        setNewMedicationSchedule("");

        setRecordModalVisible(true);
    };

    /* ================================================= */
    /* CLOSE NEW RECORD MODAL */
    /* ================================================= */

    const closeRecordModal = () => {
        setRecordModalVisible(false);
        setRecordType(null);
    };

    /* ================================================= */
    /* SAVE NEW RECORD */
    /* ================================================= */

    const saveNewRecord = () => {
        /*
         * IMPORTANT:
         * Every new record gets the actual date + time
         * when the user saves it.
         */

        const date = getCurrentDateTime();

        /* ================= BP ================= */

        if (recordType === "bp") {
            if (!newSystolic.trim() || !newDiastolic.trim()) {
                return;
            }

            const systolic = Number(newSystolic);
            const diastolic = Number(newDiastolic);

            const newReading: HistoryItem = {
                id: Date.now().toString(),
                value: `${newSystolic}/${newDiastolic}`,
                unit: "mmHg",
                date,
                status:
                    systolic >= 130 || diastolic >= 80
                        ? "High"
                        : "Normal",
            };

            /*
             * NEW READING GOES TO THE TOP.
             * Existing history remains underneath.
             * UI still displays the latest 2.
             */

            setBpHistory((previous) =>
                [newReading, ...previous].slice(0, 2)
            );
        }

        /* ================= SUGAR ================= */

        if (recordType === "sugar") {
            if (!newSugar.trim()) {
                return;
            }

            const sugar = Number(newSugar);

            const newReading: HistoryItem = {
                id: Date.now().toString(),
                value: newSugar,
                unit: "mg/dL",
                date,
                status: sugar >= 100 ? "High" : "Normal",
            };

            setSugarHistory((previous) =>
                [newReading, ...previous].slice(0, 2)
            );
        }

        /* ================= WEIGHT ================= */

        if (recordType === "weight") {
            if (!newWeight.trim()) {
                return;
            }

            const newReading: HistoryItem = {
                id: Date.now().toString(),
                value: newWeight,
                unit: "kg",
                date,
                status: "Normal",
            };

            setWeightHistory((previous) =>
                [newReading, ...previous].slice(0, 2)
            );
        }

        /* ================= CHOLESTEROL ================= */

        if (recordType === "cholesterol") {
            if (!newCholesterol.trim()) {
                return;
            }

            const cholesterol = Number(newCholesterol);

            const newReading: HistoryItem = {
                id: Date.now().toString(),
                value: newCholesterol,
                unit: "mg/dL",
                date,
                status:
                    cholesterol >= 200
                        ? "High"
                        : "Normal",
            };

            setCholesterolHistory((previous) =>
                [newReading, ...previous].slice(0, 2)
            );
        }

        /* ================= MEDICATION ================= */

        if (recordType === "medication") {
            if (
                !newMedicationName.trim() ||
                !newMedicationSchedule.trim()
            ) {
                return;
            }

            const newMedication: Medication = {
                id: Date.now().toString(),
                name: newMedicationName.trim(),
                schedule: newMedicationSchedule.trim(),
            };

            setMedications((previous) => [
                ...previous,
                newMedication,
            ]);
        }

        closeRecordModal();
    };

    const isListTab =
        selectedVital === "meds" ||
        selectedVital === "alerts";

    return (
        <SafeAreaView
            edges={["top"]}
            className="flex-1 bg-white"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 110,
                }}
            >
                {/* ================= HEADER ================= */}

                <View className="px-5 pb-5 pt-7">
                    <View className="flex-row items-center">
                        {/* BACK BUTTON */}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.back()}
                            className="mr-5 h-14 w-14 items-center justify-center rounded-full bg-[#F3F7FB]"
                        >
                            <Ionicons
                                name="chevron-back"
                                size={30}
                                color="#34445F"
                            />
                        </TouchableOpacity>

                        {/* TITLE */}

                        <View className="flex-1">
                            <Text className="text-[27px] font-bold text-[#111A31]">
                                Vital Signs
                            </Text>

                            <Text className="mt-1 text-[17px] text-[#687D9D]">
                                Track & monitor your health
                            </Text>
                        </View>

                        {/* LIVE TRACKING */}

                        <View className="flex-row items-center rounded-full border-[3px] border-[#C5F6ED] bg-[#F2FFFC] px-5 py-3">
                            <View className="mr-2 h-4 w-4 rounded-full bg-[#08A892]" />

                            <Text className="text-[16px] font-bold text-[#078F84]">
                                Live tracking
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ================= VITAL SUMMARY CARDS ================= */}

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingBottom: 12,
                    }}
                >
                    {vitalCards.map((vital) => {
                        const selected =
                            selectedVital === vital.id;

                        return (
                            <TouchableOpacity
                                key={vital.id}
                                activeOpacity={0.85}
                                onPress={() =>
                                    setSelectedVital(vital.id)
                                }
                                style={{
                                    borderColor: selected
                                        ? vital.color
                                        : "#EDF1F5",
                                    borderWidth: 3,
                                    backgroundColor:
                                    vital.background,
                                    shadowColor: "#AAB6C5",
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    shadowOpacity: selected
                                        ? 0.16
                                        : 0.1,
                                    shadowRadius: 5,
                                    elevation: 2,
                                }}
                                className="mr-4 h-[150px] w-[220px] rounded-[28px] px-5 py-5"
                            >
                                <View className="flex-row items-center">
                                    <Text className="mr-2 text-[22px]">
                                        {vital.id === "blood-group"
                                            ? "🩺"
                                            : vital.icon}
                                    </Text>

                                    <Text className="text-[17px] font-semibold text-[#637795]">
                                        {vital.title}
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        color: vital.color,
                                    }}
                                    className="mt-5 text-[27px] font-bold"
                                >
                                    {vital.id === "blood-group"
                                        ? bloodGroup
                                        : vital.value}
                                </Text>

                                <Text className="mt-1 text-[16px] text-[#91A5C2]">
                                    {vital.id === "blood-group"
                                        ? `Genotype: ${genotype}`
                                        : vital.unit}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* ================= FILTERS ================= */}

                <View className="mt-3 border-b-[3px] border-[#F1F5F8] border-t-[3px] py-4">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 30,
                        }}
                    >
                        {filterItems.map((filter) => {
                            const active =
                                selectedVital === filter.id;

                            return (
                                <TouchableOpacity
                                    key={filter.id}
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        setSelectedVital(filter.id)
                                    }
                                    className={`mr-3 flex-row items-center rounded-full px-6 py-3 ${
                                        active
                                            ? "bg-[#079B8F]"
                                            : "bg-[#F1F5F9]"
                                    }`}
                                >
                                    <Text className="mr-2 text-[18px]">
                                        {filter.icon}
                                    </Text>

                                    {filter.label !== "" && (
                                        <Text
                                            className={`text-[17px] font-semibold ${
                                                active
                                                    ? "text-white"
                                                    : "text-[#52637D]"
                                            }`}
                                        >
                                            {filter.label}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* ================================================= */}
                {/* MEDS TAB */}
                {/* ================================================= */}

                {selectedVital === "meds" && (
                    <>
                        <View className="mt-7 px-9">
                            <View className="rounded-[30px] border-[3px] border-[#D6E7FF] bg-[#EAF3FF] px-7 py-8">
                                <View className="flex-row items-start">
                                    <Text className="mr-5 text-[42px]">
                                        💊
                                    </Text>

                                    <View>
                                        <Text className="text-[27px] font-bold text-[#111A31]">
                                            Medications
                                        </Text>

                                        <Text className="mt-2 text-[19px] font-semibold text-[#2563EB]">
                                            Normal:
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View className="mt-9 px-9">
                            <Text className="text-[19px] font-semibold tracking-[1.5px] text-[#687D9D]">
                                CURRENT MEDICATIONS
                            </Text>

                            <View className="mt-6">
                                {medications.map((med) => (
                                    <View
                                        key={med.id}
                                        className="mb-5 flex-row items-center rounded-[30px] border-[3px] border-[#EEF2F6] bg-white px-7 py-6"
                                        style={{
                                            shadowColor:
                                                "#AAB6C5",
                                            shadowOffset: {
                                                width: 0,
                                                height: 3,
                                            },
                                            shadowOpacity: 0.12,
                                            shadowRadius: 5,
                                            elevation: 2,
                                        }}
                                    >
                                        <View className="mr-5 h-16 w-16 items-center justify-center rounded-[20px] bg-[#EFFBF3]">
                                            <Text className="text-[25px]">
                                                💊
                                            </Text>
                                        </View>

                                        <View className="flex-1">
                                            <Text className="text-[20px] font-bold text-[#0F9B7F]">
                                                {med.name}
                                            </Text>

                                            <Text className="mt-1 text-[17px] text-[#687D9D]">
                                                {med.schedule}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {}}
                                            className="rounded-full bg-[#EFFBF3] px-5 py-3"
                                        >
                                            <Text className="text-[16px] font-bold text-[#0F9B7F]">
                                                Info
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View className="mt-2 px-9">
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() =>
                                    openRecordModal(
                                        "medication"
                                    )
                                }
                                className="flex-row items-center justify-center rounded-[30px] bg-[#1D5FA8] py-5"
                            >
                                <Ionicons
                                    name="add-circle-outline"
                                    size={30}
                                    color="white"
                                />

                                <Text className="ml-3 text-[21px] font-bold text-white">
                                    Add medication
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* ================================================= */}
                {/* ALERTS TAB */}
                {/* ================================================= */}

                {selectedVital === "alerts" && (
                    <View className="mt-7 px-9">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-[27px] font-bold text-[#111A31]">
                                    Smart Reminders
                                </Text>

                                <Text className="mt-1 text-[17px] text-[#687D9D]">
                                    Medication, glucose & BP alerts
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => {}}
                                className="flex-row items-center rounded-full bg-[#079B8F] px-5 py-3"
                            >
                                <Ionicons
                                    name="add"
                                    size={18}
                                    color="white"
                                />

                                <Text className="ml-1 text-[16px] font-bold text-white">
                                    Add
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="mt-6">
                            {reminders.map((reminder) => (
                                <View
                                    key={reminder.id}
                                    className="mb-5 flex-row items-center rounded-[30px] border-[3px] border-[#EEF2F6] bg-white px-7 py-6"
                                    style={{
                                        shadowColor:
                                            "#AAB6C5",
                                        shadowOffset: {
                                            width: 0,
                                            height: 3,
                                        },
                                        shadowOpacity: 0.12,
                                        shadowRadius: 5,
                                        elevation: 2,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor:
                                            reminder.iconBg,
                                        }}
                                        className="mr-5 h-16 w-16 items-center justify-center rounded-[20px]"
                                    >
                                        <Text className="text-[25px]">
                                            {reminder.icon}
                                        </Text>
                                    </View>

                                    <View className="flex-1">
                                        <Text className="text-[19px] font-bold text-[#111A31]">
                                            {reminder.title}
                                        </Text>

                                        <Text className="mt-1 text-[17px] text-[#687D9D]">
                                            {reminder.time}
                                        </Text>
                                    </View>

                                    <Switch
                                        value={reminder.enabled}
                                        onValueChange={() =>
                                            toggleReminder(
                                                reminder.id
                                            )
                                        }
                                        trackColor={{
                                            false: "#E5E7EB",
                                            true: "#079B8F",
                                        }}
                                        thumbColor="#FFFFFF"
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* ================================================= */}
                {/* BLOOD GROUP + GENOTYPE */}
                {/* ================================================= */}

                {selectedVital === "blood-group" && (
                    <View className="mt-7 px-9">
                        <View
                            className="rounded-[30px] border-[3px] border-[#FFD8D8] bg-[#FFF7F7] px-7 py-7"
                            style={{
                                shadowColor: "#AAB6C5",
                                shadowOffset: {
                                    width: 0,
                                    height: 3,
                                },
                                shadowOpacity: 0.1,
                                shadowRadius: 5,
                                elevation: 2,
                            }}
                        >
                            <View className="flex-row items-center">
                                <View className="h-16 w-16 items-center justify-center rounded-[20px] bg-[#FFEAEA]">
                                    <Text className="text-[30px]">
                                        🩺
                                    </Text>
                                </View>

                                <View className="ml-5 flex-1">
                                    <Text className="text-[19px] font-semibold text-[#687D9D]">
                                        Blood Group
                                    </Text>

                                    <Text className="mt-1 text-[30px] font-bold text-[#E12D2D]">
                                        {bloodGroup}
                                    </Text>
                                </View>
                            </View>

                            <View className="mt-6 h-[1.5px] bg-[#F1DADA]" />

                            <View className="mt-5 flex-row items-center justify-between">
                                <View>
                                    <Text className="text-[17px] text-[#687D9D]">
                                        Genotype
                                    </Text>

                                    <Text className="mt-1 text-[25px] font-bold text-[#17243B]">
                                        {genotype}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={
                                        openBloodInfoEditor
                                    }
                                    className="flex-row items-center rounded-full bg-[#079B8F] px-5 py-3"
                                >
                                    <Ionicons
                                        name="create-outline"
                                        size={19}
                                        color="white"
                                    />

                                    <Text className="ml-2 text-[16px] font-bold text-white">
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text className="mt-4 px-2 text-[14px] leading-5 text-[#91A5C2]">
                            Keep your blood group and genotype
                            information up to date for accurate
                            medical records.
                        </Text>
                    </View>
                )}

                {/* ================================================= */}
                {/* VITALS-STYLE TABS */}
                {/* ================================================= */}

                {!isListTab &&
                    selectedVital !== "blood-group" && (
                        <>
                            {/* ================= MAIN VITAL CARD ================= */}

                            {selectedVital === "sugar" ? (
                                <View className="mt-7 px-9">
                                    <View className="rounded-[30px] bg-[#F1EEFE] px-7 py-8">
                                        <View className="flex-row items-start">
                                            <Text className="mr-5 text-[42px]">
                                                🩸
                                            </Text>

                                            <View>
                                                <Text className="text-[27px] font-bold text-[#111A31]">
                                                    Blood Sugar
                                                </Text>

                                                <Text className="mt-2 text-[19px] font-semibold text-[#7C5CFC]">
                                                    Normal:
                                                    70–99
                                                    (fasting)
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="mt-8 flex-row items-baseline justify-between">
                                            <View className="flex-row items-baseline">
                                                <Text
                                                    className="text-[53px] font-bold text-[#D92D2D]"
                                                >
                                                    {sugarHistory[0]?.value ||
                                                        "—"}
                                                </Text>

                                                <Text className="ml-4 text-[23px] text-[#687D9D]">
                                                    mg/dL
                                                </Text>
                                            </View>

                                            {sugarHistory[0] && (
                                                <View className="rounded-full bg-[#FFEAEA] px-5 py-3">
                                                    <Text className="text-[18px] font-bold text-[#EF3030]">
                                                        {
                                                            sugarHistory[0]
                                                                .status
                                                        }
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ) : selectedVital ===
                            "weight" ? (
                                <View className="mt-7 px-9">
                                    <View className="rounded-[30px] border-[3px] border-[#FDECC8] bg-[#FFFAEB] px-7 py-8">
                                        <View className="flex-row items-start">
                                            <Text className="mr-5 text-[42px]">
                                                ⚖️
                                            </Text>

                                            <View>
                                                <Text className="text-[27px] font-bold text-[#111A31]">
                                                    Weight
                                                </Text>

                                                <Text className="mt-2 text-[19px] font-semibold text-[#D97706]">
                                                    Normal:
                                                    BMI
                                                    18.5–24.9
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="mt-8 flex-row items-baseline justify-between">
                                            <View className="flex-row items-baseline">
                                                <Text className="text-[53px] font-bold text-[#16A34A]">
                                                    {weightHistory[0]?.value ||
                                                        "—"}
                                                </Text>

                                                <Text className="ml-4 text-[23px] text-[#687D9D]">
                                                    kg
                                                </Text>
                                            </View>

                                            {weightHistory[0] && (
                                                <View className="rounded-full bg-[#E3FBEB] px-5 py-3">
                                                    <Text className="text-[18px] font-bold text-[#16A34A]">
                                                        {
                                                            weightHistory[0]
                                                                .status
                                                        }
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ) : selectedVital ===
                            "cholesterol" ? (
                                <View className="mt-7 px-9">
                                    <View className="rounded-[30px] border-[3px] border-[#CDF3E7] bg-[#EAFBF5] px-7 py-8">
                                        <View className="flex-row items-start">
                                            <Text className="mr-5 text-[42px]">
                                                🧪
                                            </Text>

                                            <View>
                                                <Text className="text-[27px] font-bold text-[#111A31]">
                                                    Cholesterol
                                                </Text>

                                                <Text className="mt-2 text-[19px] font-semibold text-[#0F9B7F]">
                                                    Normal:
                                                    &lt; 200
                                                    total
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="mt-8 flex-row items-baseline justify-between">
                                            <View className="flex-row items-baseline">
                                                <Text className="text-[53px] font-bold text-[#16A34A]">
                                                    {cholesterolHistory[0]?.value ||
                                                        "—"}
                                                </Text>

                                                <Text className="ml-4 text-[23px] text-[#687D9D]">
                                                    mg/dL
                                                </Text>
                                            </View>

                                            {cholesterolHistory[0] && (
                                                <View className="rounded-full bg-[#E3FBEB] px-5 py-3">
                                                    <Text className="text-[18px] font-bold text-[#16A34A]">
                                                        {
                                                            cholesterolHistory[0]
                                                                .status
                                                        }
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View className="mt-7 px-9">
                                    <View className="rounded-[30px] border-[3px] border-[#FFD8D8] bg-[#FFF3F3] px-7 py-8">
                                        <View className="flex-row items-start">
                                            <Text className="mr-5 text-[42px]">
                                                ❤️
                                            </Text>

                                            <View>
                                                <Text className="text-[27px] font-bold text-[#111A31]">
                                                    Blood
                                                    Pressure
                                                </Text>

                                                <Text className="mt-2 text-[19px] font-semibold text-[#EF3030]">
                                                    Normal:
                                                    &lt; 120/80
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="mt-8 flex-row items-baseline justify-between">
                                            <View className="flex-row items-baseline">
                                                <Text className="text-[53px] font-bold text-[#D92D2D]">
                                                    {bpHistory[0]?.value ||
                                                        "—"}
                                                </Text>

                                                <Text className="ml-4 text-[23px] text-[#687D9D]">
                                                    mmHg
                                                </Text>
                                            </View>

                                            {bpHistory[0] && (
                                                <Text className="text-[20px] font-bold text-[#EF3030]">
                                                    {
                                                        bpHistory[0]
                                                            .status
                                                    }
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* ================= HISTORY ================= */}

                            <View className="mt-9 px-9">
                                <Text className="text-[19px] font-semibold tracking-[1.5px] text-[#687D9D]">
                                    HISTORY
                                </Text>

                                <View className="mt-6">
                                    {(selectedVital ===
                                        "sugar"
                                            ? sugarHistory
                                            : selectedVital ===
                                            "weight"
                                                ? weightHistory
                                                : selectedVital ===
                                                "cholesterol"
                                                    ? cholesterolHistory
                                                    : bpHistory
                                    ).map((item) => {
                                        const isHigh =
                                            item.status ===
                                            "High";

                                        const icon =
                                            selectedVital ===
                                            "sugar"
                                                ? "🩸"
                                                : selectedVital ===
                                                "weight"
                                                    ? "⚖️"
                                                    : selectedVital ===
                                                    "cholesterol"
                                                        ? "🧪"
                                                        : "❤️";

                                        return (
                                            <View
                                                key={
                                                    item.id
                                                }
                                                className="mb-5 flex-row items-center rounded-[30px] border-[3px] border-[#EEF2F6] bg-white px-7 py-6"
                                                style={{
                                                    shadowColor:
                                                        "#AAB6C5",
                                                    shadowOffset:
                                                        {
                                                            width: 0,
                                                            height: 3,
                                                        },
                                                    shadowOpacity:
                                                        0.12,
                                                    shadowRadius: 5,
                                                    elevation: 2,
                                                }}
                                            >
                                                {/* ICON */}

                                                <View
                                                    className={`mr-5 h-16 w-16 items-center justify-center rounded-[20px] ${
                                                        isHigh
                                                            ? "bg-[#FFF1F1]"
                                                            : "bg-[#EFFBF3]"
                                                    }`}
                                                >
                                                    <Text className="text-[25px]">
                                                        {
                                                            icon
                                                        }
                                                    </Text>
                                                </View>

                                                {/* READING */}

                                                <View className="flex-1">
                                                    <View className="flex-row items-baseline">
                                                        <Text
                                                            className={`text-[26px] font-bold ${
                                                                isHigh
                                                                    ? "text-[#D92D2D]"
                                                                    : "text-[#16A34A]"
                                                            }`}
                                                        >
                                                            {
                                                                item.value
                                                            }
                                                        </Text>

                                                        <Text className="ml-2 text-[18px] text-[#91A5C2]">
                                                            {
                                                                item.unit
                                                            }
                                                        </Text>
                                                    </View>

                                                    <Text className="mt-1 text-[17px] text-[#687D9D]">
                                                        {
                                                            item.date
                                                        }
                                                    </Text>
                                                </View>

                                                {/* STATUS */}

                                                <View
                                                    className={`rounded-full px-5 py-3 ${
                                                        isHigh
                                                            ? "bg-[#FFF0F0]"
                                                            : "bg-[#EEFBF3]"
                                                    }`}
                                                >
                                                    <Text
                                                        className={`text-[16px] font-bold ${
                                                            isHigh
                                                                ? "text-[#E12D2D]"
                                                                : "text-[#16A34A]"
                                                        }`}
                                                    >
                                                        {
                                                            item.status
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* ================= LOG READING ================= */}

                            <View className="mt-2 px-9">
                                {selectedVital ===
                                "sugar" ? (
                                    <TouchableOpacity
                                        activeOpacity={0.85}
                                        onPress={() =>
                                            openRecordModal(
                                                "sugar"
                                            )
                                        }
                                        className="flex-row items-center justify-center rounded-[30px] bg-[#7C5CFC] py-5"
                                    >
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={30}
                                            color="white"
                                        />

                                        <Text className="ml-3 text-[21px] font-bold text-white">
                                            Log new Blood
                                            Sugar reading
                                        </Text>
                                    </TouchableOpacity>
                                ) : selectedVital ===
                                "weight" ? (
                                    <TouchableOpacity
                                        activeOpacity={0.85}
                                        onPress={() =>
                                            openRecordModal(
                                                "weight"
                                            )
                                        }
                                        className="flex-row items-center justify-center rounded-[30px] bg-[#F59E0B] py-5"
                                    >
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={30}
                                            color="white"
                                        />

                                        <Text className="ml-3 text-[21px] font-bold text-white">
                                            Log new Weight
                                            reading
                                        </Text>
                                    </TouchableOpacity>
                                ) : selectedVital ===
                                "cholesterol" ? (
                                    <TouchableOpacity
                                        activeOpacity={0.85}
                                        onPress={() =>
                                            openRecordModal(
                                                "cholesterol"
                                            )
                                        }
                                        className="flex-row items-center justify-center rounded-[30px] bg-[#0F9B7F] py-5"
                                    >
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={30}
                                            color="white"
                                        />

                                        <Text className="ml-3 text-[21px] font-bold text-white">
                                            Log new
                                            Cholesterol
                                            reading
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        activeOpacity={0.85}
                                        onPress={() =>
                                            openRecordModal(
                                                "bp"
                                            )
                                        }
                                        className="flex-row items-center justify-center rounded-[30px] bg-[#F45151] py-5"
                                    >
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={30}
                                            color="white"
                                        />

                                        <Text className="ml-3 text-[21px] font-bold text-white">
                                            Log new Blood
                                            Pressure
                                            reading
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </>
                    )}
            </ScrollView>

            {/* ================================================= */}
            {/* EDIT BLOOD GROUP / GENOTYPE MODAL */}
            {/* ================================================= */}

            <Modal
                visible={editBloodInfoVisible}
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setEditBloodInfoVisible(false)
                }
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View className="rounded-t-[35px] bg-white px-7 pb-10 pt-7">
                        {/* MODAL HEADER */}

                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-[26px] font-bold text-[#111A31]">
                                    Update health information
                                </Text>

                                <Text className="mt-1 text-[15px] text-[#687D9D]">
                                    Keep your blood details accurate
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() =>
                                    setEditBloodInfoVisible(
                                        false
                                    )
                                }
                                className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F7FB]"
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#34445F"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* BLOOD GROUP */}

                        <View className="mt-7">
                            <Text className="mb-3 text-[16px] font-bold text-[#34445F]">
                                Blood Group
                            </Text>

                            <TextInput
                                value={editingBloodGroup}
                                onChangeText={
                                    setEditingBloodGroup
                                }
                                placeholder="e.g. O+"
                                autoCapitalize="characters"
                                className="rounded-2xl border-[2px] border-[#E4EAF0] bg-[#F8FAFC] px-5 py-4 text-[19px] font-bold text-[#17243B]"
                            />
                        </View>

                        {/* GENOTYPE */}

                        <View className="mt-5">
                            <Text className="mb-3 text-[16px] font-bold text-[#34445F]">
                                Genotype
                            </Text>

                            <TextInput
                                value={editingGenotype}
                                onChangeText={
                                    setEditingGenotype
                                }
                                placeholder="e.g. AS"
                                autoCapitalize="characters"
                                className="rounded-2xl border-[2px] border-[#E4EAF0] bg-[#F8FAFC] px-5 py-4 text-[19px] font-bold text-[#17243B]"
                            />
                        </View>

                        {/* SAVE BUTTON */}

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={saveBloodInfo}
                            className="mt-7 items-center rounded-[22px] bg-[#079B8F] py-5"
                        >
                            <Text className="text-[18px] font-bold text-white">
                                Save changes
                            </Text>
                        </TouchableOpacity>

                        {/* CANCEL */}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                setEditBloodInfoVisible(
                                    false
                                )
                            }
                            className="mt-3 items-center py-3"
                        >
                            <Text className="text-[16px] font-bold text-[#687D9D]">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ================================================= */}
            {/* NEW VITAL / MEDICATION BOTTOM SHEET */}
            {/* ================================================= */}

            <Modal
                visible={recordModalVisible}
                transparent
                animationType="slide"
                onRequestClose={closeRecordModal}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View className="rounded-t-[35px] bg-white px-7 pb-10 pt-7">
                        {/* MODAL HEADER */}

                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-[26px] font-bold text-[#111A31]">
                                    {recordType === "bp"
                                        ? "Log Blood Pressure"
                                        : recordType === "sugar"
                                            ? "Log Blood Sugar"
                                            : recordType === "weight"
                                                ? "Log Weight"
                                                : recordType ===
                                                "cholesterol"
                                                    ? "Log Cholesterol"
                                                    : "Add medication"}
                                </Text>

                                <Text className="mt-1 text-[15px] text-[#687D9D]">
                                    {recordType ===
                                    "medication"
                                        ? "Add a new medication to your list"
                                        : "Enter your latest reading"}
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={closeRecordModal}
                                className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F7FB]"
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#34445F"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* ================================================= */}
                        {/* BLOOD PRESSURE FORM */}
                        {/* ================================================= */}

                        {recordType === "bp" && (
                            <View className="mt-7">
                                <Text className="mb-3 text-[16px] font-bold text-[#34445F]">
                                    Blood Pressure
                                </Text>

                                <View className="flex-row">
                                    <View className="mr-2 flex-1">
                                        <Text className="mb-2 text-[14px] text-[#687D9D]">
                                            Systolic
                                        </Text>

                                        <TextInput
                                            value={newSystolic}
                                            onChangeText={
                                                setNewSystolic
                                            }
                                            keyboardType="numeric"
                                            placeholder="120"
                                            placeholderTextColor="#91A5C2"
                                            className="rounded-2xl border-[2px] border-[#E4EAF0] bg-[#F8FAFC] px-5 py-4 text-[19px] font-bold text-[#17243B]"
                                        />
                                    </View>

                                    <View className="ml-2 flex-1">
                                        <Text className="mb-2 text-[14px] text-[#687D9D]">
                                            Diastolic
                                        </Text>

                                        <TextInput
                                            value={newDiastolic}
                                            onChangeText={
                                                setNewDiastolic
                                            }
                                            keyboardType="numeric"
                                            placeholder="80"
                                            placeholderTextColor="#91A5C2"
                                            className="rounded-2xl border-[2px] border-[#E4EAF0] bg-[#F8FAFC] px-5 py-4 text-[19px] font-bold text-[#17243B]"
                                        />
                                    </View>
                                </View>

                                <Text className="mt-3 text-[14px] text-[#91A5C2]">
                                    Example: 120/80 mmHg
                                </Text>
                            </View>
                        )}

                        {/* ================================================= */}
                        {/* BLOOD SUGAR FORM */}
                        {/* ================================================= */}

                        {recordType === "sugar" && (
                            <View className="mt-7">
                                <Text className="mb-3 text-[16px] font-bold text-[#34445F]">
                                    Blood Sugar
                                </Text>

                                <TextInput
                                    value={newSugar}
                                    onChangeText={setNewSugar}
                                    keyboardType="numeric"
                                    placeholder="110"
                                    placeholderTextColor="#91A5C2"
                                    className="rounded-2xl border-[2px] border-[#E4EAF0] bg-[#F8FAFC] px-5 py-4 text-[19px] font-bold text-[#17243B]"
                                />

                                <Text className="mt-3 text-[14px] text-[#91A5C2]">
                                    Enter your reading in mg/dL
                                </Text>
                            </View>
                        )}

                        {/* ================================================= */}
                        {/* WEIGHT FORM */}
                        {/* ================================================= */}

                        {recordType === "weight" && (
                            <View className="mt-7">
                                <Text className="mb-3 text-[16px] font-bold text-[#34445F]">
                                    Weight
                                </Text>

                                <TextInput
                                    value={newWeight}
                                    onChangeText={setNewWeight}
                                    keyboardType="decimal-pad"
                                    placeholder="78.5"
                                    placeholderTextColor="#91A5C2"
                                    className="rounded-2xl border-[2px] border-[#E4EAF0] bg-[#F8FAFC] px-5 py-4 text-[19px] font-bold text-[#17243B]"
                                />

                                <Text className="mt-3 text-[14px] text-[#91A5C2]">
                                    Enter your weight in kg
                                </Text>
                            </View>
                        )}

                        {/* ================================================= */}
                        {/* CHOLESTEROL FORM */}
                        {/* ================================================= */}

                        {recordType === "cholesterol" && (
                            <View className="mt-7">
                                <Text className="mb-3 text-[16px] font-bold text-[#34445F]">
                                    Cholesterol
                                </Text>

                                <TextInput
                                    value={newCholesterol}
                                    onChangeText={
                                        setNewCholesterol
                                    }
                                    keyboardType="numeric"
                                    placeholder="195"
                                    placeholderTextColor="#91A5C2"
                                    className="rounded-2xl border-[2px] border-[#E4EAF0] bg-[#F8FAFC] px-5 py-4 text-[19px] font-bold text-[#17243B]"
                                />

                                <Text className="mt-3 text-[14px] text-[#91A5C2]">
                                    Enter your reading in mg/dL
                                </Text>
                            </View>
                        )}

                        {/* ================================================= */}
                        {/* MEDICATION FORM */}
                        {/* ================================================= */}

                        {recordType === "medication" && (
                            <View className="mt-7">
                                <Text className="mb-3 text-[16px] font-bold text-[#34445F]">
                                    Medication name
                                </Text>

                                <TextInput
                                    value={newMedicationName}
                                    onChangeText={
                                        setNewMedicationName
                                    }
                                    placeholder="e.g. Amlodipine 5mg"
                                    placeholderTextColor="#91A5C2"
                                    className="rounded-2xl border-[2px] border-[#E4EAF0] bg-[#F8FAFC] px-5 py-4 text-[19px] font-bold text-[#17243B]"
                                />

                                <Text className="mb-3 mt-5 text-[16px] font-bold text-[#34445F]">
                                    Schedule
                                </Text>

                                <TextInput
                                    value={newMedicationSchedule}
                                    onChangeText={
                                        setNewMedicationSchedule
                                    }
                                    placeholder="e.g. Daily at 8:00 AM"
                                    placeholderTextColor="#91A5C2"
                                    className="rounded-2xl border-[2px] border-[#E4EAF0] bg-[#F8FAFC] px-5 py-4 text-[19px] font-bold text-[#17243B]"
                                />
                            </View>
                        )}

                        {/* ================================================= */}
                        {/* SAVE BUTTON */}
                        {/* ================================================= */}

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={saveNewRecord}
                            className="mt-7 items-center rounded-[22px] bg-[#079B8F] py-5"
                        >
                            <Text className="text-[18px] font-bold text-white">
                                {recordType === "medication"
                                    ? "Add medication"
                                    : "Save reading"}
                            </Text>
                        </TouchableOpacity>

                        {/* ================================================= */}
                        {/* CANCEL */}
                        {/* ================================================= */}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={closeRecordModal}
                            className="mt-3 items-center py-3"
                        >
                            <Text className="text-[16px] font-bold text-[#687D9D]">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default VitalSigns;
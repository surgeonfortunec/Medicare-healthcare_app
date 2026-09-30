import { Query } from "react-native-appwrite";
import { tablesDB } from "./appwrite";

const DATABASE_ID = "6aba30bf0023d760bc24";

const FACILITIES_TABLE_ID = "6aba40f0001de33c36c3";
const SERVICES_TABLE_ID = "6abb0ad9001d2f2f2b0c";

export const getFacilities = async () => {
    try {
        const response = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: FACILITIES_TABLE_ID,
            queries: [
                Query.equal("active", true),
            ],
        });

        return response.rows;
    } catch (error) {
        console.error("Error fetching facilities:", error);
        throw error;
    }
};

export const getServices = async () => {
    try {
        const response = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: SERVICES_TABLE_ID,
        });

        console.log("SERVICES FROM APPWRITE:", response.rows);

        return response.rows;
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
    }
};

export const getFacilitiesByType = async (facilityType: string) => {
    try {
        const response = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: FACILITIES_TABLE_ID,
            queries: [
                Query.equal("facilityType", facilityType),
                Query.equal("active", true),
            ],
        });

        return response.rows;
    } catch (error) {
        console.error("Error fetching facilities by type:", error);
        throw error;
    }
};

export const getServicesByCategory = async (category: string) => {
    try {
        const response = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: SERVICES_TABLE_ID,
            queries: [
                Query.equal("category", category),
                Query.equal("active", true),
            ],
        });

        return response.rows;
    } catch (error) {
        console.error("Error fetching services by category:", error);
        throw error;
    }
};
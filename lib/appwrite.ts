import { Client, Account, TablesDB } from "react-native-appwrite";

const client = new Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("6ab9c50e0027a934e8b4")
    .setPlatform("com.anonymous.Medicare");

export const account = new Account(client);

export const tablesDB = new TablesDB(client);

export default client;
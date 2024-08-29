import AsyncStorage from "@react-native-async-storage/async-storage";

// Store data in AsyncStorage
export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log('Error storing value:', error);
    }
};

// Retrieve data from AsyncStorage
export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.log('Error retrieving value:', error);
        return null; // Return null in case of error
    }
};

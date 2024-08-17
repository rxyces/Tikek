import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const secureStorage = {
    async getItem(key) {
        try {
            const item = await SecureStore.getItemAsync(key)
            if (item) {
            console.log(`${key} was used \n`)
            } else {
            console.log('No values stored under key: ' + key)
            }
            return item
        } catch (error) {
            console.error('SecureStore get item error: ', error)
            await SecureStore.deleteItemAsync(key)
            return null
        }
        },
    async setItem(key, value) {
        try {
            return SecureStore.setItemAsync(key, value)
        } catch (err) {
            return
        }
        },
    async deleteItem(key) {
        try {
            await SecureStore.deleteItemAsync(key);
            console.log(`${key} has been deleted \n`);
        } catch (error) {
            console.error('SecureStore delete item error:', error);
            return
        }
    },
}

export const asyncStorage = {
    async getItem(key) {
        try {
            const item = await AsyncStorage.getItem(key);
            if (item) {
                console.log(`${key} was used \n`);
            } else {
                console.log('No values stored under key: ' + key);
            }
            return item;
        } catch (error) {
            console.error('AsyncStorage get item error: ', error);
            return null;
        }
    },

    async setItem(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('AsyncStorage set item error: ', error);
        }
    },

    async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
            console.log(`${key} has been deleted \n`);
        } catch (error) {
            console.error('AsyncStorage remove item error:', error);
        }
    },

    async clearAll() {
        try {
            await AsyncStorage.clear();
            console.log('AsyncStorage cleared successfully!');
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    }
};
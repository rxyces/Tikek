import { Text } from 'react-native';
import { router } from 'expo-router';

import { tokenCache } from '../context/TokenCache';


// if there is critcal error during sign up process do this
export const errorCleanup = async ( {signOut} ) => {
    await new Promise(r => setTimeout(r, 2000))
    await tokenCache.deleteToken("userSettings")
    signOut({ redirectUrl: '/' })
    if (router.canDismiss())
        router.dismissAll()
        router.replace("/")
}

// show server errors
const Error = ({ errorText }) => {
    if (errorText) {
        return (
        <Text className="font-wregular text-[14px] text-[#E11414] m-4 text-center">
            {errorText}
        </Text>
        );
    } else { 
        return null;
    }
};

export default Error;

import {  Redirect, router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo'
import { useClerk } from '@clerk/clerk-expo'

import Loading from '../components/Loading';
import { tokenCache } from '../context/TokenCache';
import { useEffect } from 'react';
import { errorCleanup } from '../components/Error';


const AuthLoader = () => {
    // const { isLoading, isAuthenticated } = useAuth();
    const { isSignedIn, isLoaded } = useAuth();
    const { signOut } = useClerk()

    //everytime the componenent loads check if user settings have been filed ( so if user is signed up and has the sign up data saved)
    useEffect(() => {
        const checkUserSettings = async () => {
            //convert from storage back to string
            const userSettings = await tokenCache.getToken("userSettings")
            const userSettingsString = JSON.parse(userSettings)

            // if user is signedin so the jwt is found but there are no user settings saved something messed up in the sign up process to not save their details so give error
            if (isSignedIn && !userSettingsString) {
                await errorCleanup({signOut})
            
            // if user is signed in but they havent got a city saved then they havent fully finished the sign up process and are brought to the FindCity page
            } else if (isSignedIn && !userSettingsString.city) {
                if (router.canDismiss())
                    router.dismissAll()
                router.replace("/FindCity")
            }
        }
        checkUserSettings()
    }, [])

    if (!isLoaded) {
        return (
            <Loading/>
        )
    }
    return isSignedIn ? (
        // Content for authenticated users
        <Redirect href={"/Home"}/>
    ) : (
        // Stack navigation for unauthenticated users
        <Redirect href={"/Landing"}/>
    );
}   

export default AuthLoader
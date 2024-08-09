import { SplashScreen, Stack } from 'expo-router'
import { useFonts } from "expo-font";
import { useEffect } from 'react';
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { tokenCache } from '../context/TokenCache';


//clerk api key
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

//throw error if key not found
if (!publishableKey) {
    throw new Error(
        'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
    );
}

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

    //load all the fonts to use in tailwind
    const [fontsLoaded, error] = useFonts({
        "WorkSans-Regular": require("../assets/fonts/WorkSans-Regular.ttf"),
        "WorkSans-Medium": require("../assets/fonts/WorkSans-Medium.ttf"),
        "WorkSans-SemiBold": require("../assets/fonts/WorkSans-SemiBold.ttf"),
        "RedHatText-Bold": require("../assets/fonts/RedHatText-Bold.ttf"),
    })
    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) SplashScreen.hideAsync()   
    }, [fontsLoaded, error])
    
    if (!fontsLoaded && !error) return null;

    return (
        //clerk wrapper to provide context to whole app as this is the entry point layout
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            {/* clerk loaded makes sure its been loaded without having to check it exists */}
            <ClerkLoaded>
                <View className="h-full bg-[#131316]">
                    <Stack screenOptions={{headerShown: false, contentStyle: { backgroundColor: "#131316"}}}/>
                </View>
                <StatusBar style="light"/>
            </ClerkLoaded>  
        </ClerkProvider>
    )
}

export default RootLayout


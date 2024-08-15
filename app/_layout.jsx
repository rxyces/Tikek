import { SplashScreen, Stack } from 'expo-router'
import { useFonts } from "expo-font";
import { useEffect } from 'react';
import { View, AppState } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';

import AuthContext from '../context/Auth';


AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

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
        <AuthContext>
            <View className="h-full bg-[#131316]">
                <Stack screenOptions={{headerShown: false, contentStyle: { backgroundColor: "#131316"}}}/>
            </View>
            <StatusBar style="light"/>
        </AuthContext>
    )
}

export default RootLayout


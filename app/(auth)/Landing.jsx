import { View, Text, ImageBackground, TouchableOpacity  } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';

import AuthButton from '../../components/AuthButton';


const Landing = () => {
    //entry point for all auth apps the landing page

    //load background image
    const source = require("../../assets/images/landing_background.png")

    return (
        <ImageBackground source={source} className="flex-1">
            <SafeAreaView className="flex-1 items-center"> 

                {/* //title */}
                <Text className="font-rbold text-[32px] text-white mt-4">
                    Qswap
                </Text>

                {/* //container for slogans */}
                <View className="mt-48 w-[300px] space-y-8">
                    <Text className="font-wsemibold text-[48px] text-white">
                        Buy & sell tickets, near you
                    </Text>
                    <Text className="font-wregular text-[16px] text-[#DFE3EC]">
                        Cash in your tickets, or beat the FOMO and grab a last minute pass
                    </Text>
                </View>
                
                {/* //container for the buttons at the bottom */}
                <View className="flex-1 items-center justify-end space-y-4">
                    <AuthButton
                    onPress={() => router.push("/EnterPhone")}
                    text="Create account"
                    bgColor="#791DF3"
                    shadowColor="#8983F3"/>

                    <TouchableOpacity
                    className="px-20 py-6 -mx-20 -my-6 mb-8 "
                    activeOpacity={0.8}
                    onPress={() => router.push("/FindCity")}>
                        <Text className="font-wsemibold text-[16px] text-white self-center">
                            Or sign in
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default Landing


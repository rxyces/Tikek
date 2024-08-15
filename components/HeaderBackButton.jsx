import { Pressable, View } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../lib/supabase'

import BackButton from "../assets/svgs/back_button.svg"

// back button on navigation
const HeaderBackButton = ({signOut=false}) => {
    return (
        // if theres nowhere to go back to then just go to root by default
        <Pressable 
        onPress={async () => {
            if (router.canGoBack()) {
                router.back()
            }
            else if (signOut) {
                const { error } = await supabase.auth.signOut()
                if (error) {
                    console.error(JSON.stringify(error, null, 2))
                }
                else {
                    router.replace("/")
                }
            }
            else {
                router.replace("/")
            }
            
            }}
        style={({pressed}) => ({opacity: pressed ? 0.8 : 1})} 
        >
            <View className="px-28 -mx-28">
                <BackButton width={35} height={30}/>
            </View>
        </Pressable>
    )
}

export default HeaderBackButton
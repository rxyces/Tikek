import { View, Text, Pressable } from 'react-native'
import { supabase } from '../../lib/supabase'
import { router } from 'expo-router'

const Home = () => {
    return (
        <View>
            <Text className="text-white text-3xl">Home</Text>
            <Pressable
            onPress={async () => {
                const { error } = await supabase.auth.signOut()
                router.replace("/")}}>
                <Text className="text-3xl text-white">
                    sign out
                </Text>
            </Pressable>
        </View>
    )
}

export default Home
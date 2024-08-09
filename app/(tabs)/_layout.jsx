import { View, Text } from 'react-native'
import { Stack } from 'expo-router'

const TabLayout = () => {
    return (
        <Stack screenOptions={{headerShown: false, contentStyle: { backgroundColor: "#131316"}}}>
            <Stack.Screen name="Home"/>
        </Stack>
    )
}

export default TabLayout
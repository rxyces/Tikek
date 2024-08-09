import { Stack } from 'expo-router'


const AuthLayout = () => {
    return (
        //layout for all auth stuff so both sign up and log in
        <Stack screenOptions={{headerShown: false, contentStyle: { backgroundColor: "#131316"}, headerStyle: {backgroundColor: "#131316"}}}>
            <Stack.Screen name="Landing"/>
        </Stack>
    )
}

export default AuthLayout
import { Stack } from "expo-router"

import AuthenticatedContext from "../../context/AuthenticatedContext"

const AuthenticatedLayout = () => {
    return (
        <AuthenticatedContext>
            <Stack screenOptions={{headerShown: false, contentStyle: { backgroundColor: "#131316"}, headerStyle: {backgroundColor: "#131316"}}}>
                <Stack.Screen name="(tabsNav)"/>
                <Stack.Screen name="(innerAuthenticated)"/>
            </Stack>
        </AuthenticatedContext>
    )
}

export default AuthenticatedLayout
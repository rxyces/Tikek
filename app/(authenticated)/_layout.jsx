import { Stack } from "expo-router"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AuthenticatedContext from "../../context/AuthenticatedContext"
const queryClient = new QueryClient()

const AuthenticatedLayout = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthenticatedContext>
                <Stack screenOptions={{headerShown: false, contentStyle: { backgroundColor: "#131316"}, headerStyle: {backgroundColor: "#131316"}}}>
                    <Stack.Screen name="(tabsNav)"/>
                    <Stack.Screen name="(innerAuthenticated)"/>
                </Stack>
            </AuthenticatedContext>
        </QueryClientProvider>
    )
}

export default AuthenticatedLayout
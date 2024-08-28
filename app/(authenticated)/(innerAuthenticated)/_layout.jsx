import { Stack } from 'expo-router';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import HeaderBackButton from '../../../components/HeaderBackButton';

const innerAuthenticatedLayout = () => {
    //layout for all screens within the tabs of the main authentcicated layout like pressing onto an event
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    headerTintColor: "#F3F5F9",
                    headerTitle: "",
                    headerLeft: () => (<HeaderBackButton />),
                    contentStyle: { backgroundColor: "#131316" },
                    headerStyle: { backgroundColor: "#131316" }
                }}
                >
                <Stack.Screen name="events/[id]" />
            </Stack>
        </TouchableWithoutFeedback>
    );
}

export default innerAuthenticatedLayout
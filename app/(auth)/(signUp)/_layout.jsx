import { Stack } from 'expo-router';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import HeaderBackButton from '../../../components/HeaderBackButton';
import SignUpContext from '../../../context/SignUpContext';

const SignUpLayout = () => {
    //layout for all sign up pages as they are enclosed in the sign up context
    return (
        <SignUpContext>
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
                    <Stack.Screen name="EnterPhone" />
                    <Stack.Screen name="VerifyPhone"/>
                    <Stack.Screen name="AccountDetails"/>
                    <Stack.Screen name="FindCity"/>
                </Stack>
            </TouchableWithoutFeedback>
        </SignUpContext>
    );
};

export default SignUpLayout;
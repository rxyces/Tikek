import { Stack } from 'expo-router';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import HeaderBackButton from '../../../components/HeaderBackButton';
import SignInContext from '../../../context/SignInContext';

const SignUpLayout = () => {
    //layout for all sign in pages as they are enclosed in the sign in context
    return (
        <SignInContext>
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
                    <Stack.Screen name="Login" />
                </Stack>
            </TouchableWithoutFeedback>
        </SignInContext>
    );
};

export default SignUpLayout;
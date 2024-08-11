import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native'
import { Image } from 'expo-image';
import { useSignIn } from '@clerk/clerk-expo';
import { router } from 'expo-router';

import { useSignInContext } from '../../../context/SignInContext';
import AuthButton from '../../../components/AuthButton';
import Error from '../../../components/Error';
import LoginPhoneIcon from "../../../assets/svgs/login_phone_icon.svg"
import PasswordIcon from "../../../assets/svgs/password_icon.svg"
import CountryModal from '../../../components/CountryModal';

const Login = () => {
    //load queue background image
    const source = require("../../../assets/images/login_queue_background_image.png");

    // setup error and modal states
    const [errorText, setErrorText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [secureText, setSecureText] = useState(true)
    const [password, setPassword] = useState("")
    const onModalInteraction = () => setIsModalVisible(!isModalVisible)

    // defining contexts
    const { phoneNum, setPhoneNum, selectedCountryNumber, setSelectedCountryNumber, formattedPhoneNum, setFormattedPhoneNum } = useSignInContext();
    const { signIn } = useSignIn()

    // func for taking phone number input
    const onEnterPhoneNum = (num) => {
        setPhoneNum(num)

        //for the clerk format the first number of the actual number cannot be 0 so set from 1st number onwards
        if (num && num.length > 0 && num[0] == "0") {
            setFormattedPhoneNum(selectedCountryNumber + num.substring(1))
        }
        else {
            setFormattedPhoneNum(selectedCountryNumber + num)
        }
    }

    // func for performing login
    const handleFormSubmit = async () => {

        let score = 0;

        if (password.length >= 8) {
            score += 1;
        }
        if (/[a-z]/.test(password)) {
            score += 1;
        }
        if (/[A-Z]/.test(password)) {
            score += 1;
        }
        if (/\d/.test(password)) {
            score += 1;
        }
        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
        }

        if (phoneNum.length < 5) {
            setErrorText("Invalid phone number, try again")
        }

        else if (score != 5) {
            setErrorText("Invalid password, try again")
        }
        
        else {
            setErrorText("")
            try {
                const signInAttempt  = await signIn.create({
                    identifier: formattedPhoneNum,
                    strategy: "password",
                    password: password,
                })
                if (signInAttempt.status == "complete") {
                    await setActive({ session: signInAttempt.createdSessionId })
                    if (router.canDismiss()) {
                        router.dismissAll()
                    }
                    router.replace("/")
                }
            }
            catch (error) {
                switch (error.errors[0].code) {
                    case "form_param_format_invalid":
                        setErrorText("No account associated with this number")
                        break
                    case "form_password_incorrect":
                        setErrorText("Incorrect password, try again")
                        break
                    case "session_exists":
                        setErrorText("Your are already logged in, restart")
                        break
                    default:
                        console.error(JSON.stringify(error, null, 2))
                        setErrorText("Unexpected error, please try again later")
                        break
                }
            }
        }
    }
    

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            
            <View className="flex-1 items-center mt-4">

                {/* background image */}
                <View className="h-[100px] w-full">
                    <Image
                    className="flex-1"
                    source={source}
                    contentFit="fill"
                    />
                </View>
                
                {/* sign up text */}
                <View className="items-center mt-8 space-y-4">
                    <Text className="font-wsemibold text-[30px] text-white">
                        Welcome back to Qswap
                    </Text>
                    <Text className="font-wregular text-[16px] text-[#DFE3EC]">
                        Buy. Sell. Experience.
                    </Text>
                </View>
                
                <View className="space-y-8 mt-16">

                    {/* phone number input */}
                    <View className="w-[340px] h-[50px] rounded-2xl bg-[#2B2E34] items-center flex-row">
                        <Pressable
                        style={({pressed}) => ({opacity: pressed ? 0.8 : 1})}
                        onPress={onModalInteraction}
                        >
                            <View className="flex-row pl-4">
                                <LoginPhoneIcon width={23} height={23}/>
                                <Text className="font-wsemibold text-[20px] text-[#DFE3EC] pl-4">
                                    {phoneNum ? selectedCountryNumber + " " : ""}
                                </Text>
                            </View> 
                        </Pressable>
                        <TextInput
                        onChangeText={onEnterPhoneNum}
                        value={phoneNum}
                        autoFocus
                        placeholder='Phone number'
                        keyboardType='numeric'
                        autoComplete='tel'
                        placeholderTextColor="#DFE3EC"
                        className="font-wsemibold text-[20px] text-[#DFE3EC] pr-12 w-full h-full"/>
                    </View>

                    {/* password input container */}
                    <View>
                        <View className="w-[340px] h-[50px] rounded-2xl bg-[#2B2E34] items-center flex-row">
                            <View className="w-5/6 flex-row">
                                <View className="ml-4">
                                    <PasswordIcon width={23} height={23}/>
                                </View>
                                <TextInput
                                onChangeText={(text) => {setPassword(text)}}
                                value={password}
                                placeholder='Password'
                                keyboardType='default'
                                autoComplete='off'
                                secureTextEntry={secureText}
                                placeholderTextColor="#DFE3EC"
                                onSubmitEditing={handleFormSubmit}
                                className="font-wsemibold text-[20px] text-[#DFE3EC] pl-2 pr-12 w-full h-full"/>
                            </View>

                            {/* show password button */}
                            <Pressable
                            style={({pressed}) => ({opacity: pressed ? 0.8 : 1})}
                            onPress={() => setSecureText(!secureText)}
                            >
                                <Text className="font-wregular text-[16px] text-[#C1BBF6] underline">
                                    {secureText ? "show" : "hide"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                </View>

                <View className="flex-1 justify-end mb-28 items-center">
                    <Error errorText={errorText}/>
                    <AuthButton
                        onPress={handleFormSubmit}
                        text="Sign in"
                        bgColor="#791DF3"
                        shadowColor="#8983F3"
                        disabled={phoneNum.length == 0 || password.length == 0 ? true : false}/>
                </View>

                <CountryModal 
                    onModalInteraction={onModalInteraction} 
                    isModalVisible={isModalVisible} 
                    setSelectedCountryNumber={setSelectedCountryNumber} 
                    />
            </View>
        </ScrollView>
    )
}

export default Login
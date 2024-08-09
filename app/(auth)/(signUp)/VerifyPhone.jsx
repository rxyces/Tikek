import { View, Text, Keyboard, StyleSheet, Pressable, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect } from 'react';
import { OtpInput } from "react-native-otp-entry";
import { useSignUp } from '@clerk/clerk-expo'

import AuthButton from '../../../components/AuthButton';
import { useSignUpContext } from '../../../context/SignUpContext';
import Error from '../../../components/Error';

const VerifyPhone = () => {
    const { formattedPhoneNum } = useSignUpContext()
    const [smsTimer, setSmsTimer] = useState(0);
    const [clock, setClock ] = useState()
    const [otpCode, setOtpCode] = useState("");
    const [errorText, setErrorText] = useState("");
    const { signUp } = useSignUp()

    //timer for when to resend code
    function startTimer() {
        setSmsTimer(60)
        setClock(setInterval(() => {
            setSmsTimer((prevTimer) => {
                if (prevTimer > 0) {
                    return prevTimer - 1; 
                } else {
                    clearInterval(clock);
                    return 0;
                }})
        }, 1000))
    }
    //reset timer when component reloads
    useEffect(() => {
        return () => {
            if (clock) {
                clearInterval(clock);
            }
            };
    }, [clock]);

    //clerk resend code
    const resendCode = async () => {
        try {
            await signUp.preparePhoneNumberVerification()
            setErrorText("")
            startTimer()
        }
        catch (error) {
            if (error.status == 429) {
                setErrorText("Please wait 30s to receive your code")
            }
            else {
                console.error(JSON.stringify(error, null, 2))
                setErrorText("Unexpected error, please try again later")
            }
            }
        }

    //clerk submit code
    const submitCode = async () => {
        try {
            const phoneVeriyResp = await signUp.attemptPhoneNumberVerification({code: otpCode});
            setErrorText("")

            //if missing requirements means the code was correct and proceed to next page
            if (phoneVeriyResp.status === "missing_requirements") {
                router.replace("/AccountDetails")
            }
            else {
                console.error("Did not return missing_requirments on phone signup")
                setErrorText("Unexpected error, please try again later")
            }
        } catch (error) {
            switch (error.errors[0].code) {
                case "verification_expired":
                    setErrorText("Verification expired, try again")
                    await new Promise(r => setTimeout(r, 1000))
                    router.back()
                    break
                case "form_code_incorrect":
                    setErrorText("Incorrect code, try again")
                    break
                case "verification_failed":
                    setErrorText("Too many failed attempts, try again")
                    await new Promise(r => setTimeout(r, 1000))
                    router.back()
                    break
                default:
                    console.error(JSON.stringify(error, null, 2))
                    setErrorText("Unexpected error, please try again later")
                    break
            }
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View className="flex-1 items-center mt-4">
                
                {/* text at the top */}
                <Text className="font-wsemibold text-white text-[30px]">
                    Verify phone number
                </Text>
                <View className="max-w-[250px] mt-2">
                    <Text className="font-wregular text-[#ADB3C1] text-[16px] text-center">
                        Please enter the 4 digit number sent to
                        <Text className="font-wsemibold text-[#C1BBF6] text-[16px] text-center">
                            {" " + formattedPhoneNum}
                        </Text>
                    </Text>
                </View>
                
                {/* error above the opt input code */}
                <View className="mt-24">
                    <Error errorText={errorText}/>
                        <OtpInput 
                        numberOfDigits={6} 
                        onTextChange={(text) => setOtpCode(text)} 
                        onFilled={Keyboard.dismiss}
                        theme={{
                        pinCodeContainerStyle: styles.pinCodeContainer,
                        focusedPinCodeContainerStyle : styles.focusedPinCodeContainer,
                        focusStickStyle: styles.focusStick,
                        pinCodeTextStyle: styles.pinCodeText,
                        containerStyle: styles.container
                        }}
                        />
                </View>

                {/* resend code pressable */}
                <Pressable
                onPress={resendCode}
                style={({ pressed }) => [
                    { opacity: pressed ? 0.8 : 1 }, 
                    smsTimer !== 0 && { opacity: 0.6 }
                ]}
                disabled={smsTimer !== 0}>
                    <View className="px-16 py-4 -mx-16 -my-4 mt-8 space-y-2">
                        <Text className="font-wregular text-[#ADB3C1] text-[16px] text-center">
                            Didn't receive a code?
                        </Text>
                        <Text className="font-wsemibold text-[#C1BBF6] text-[16px] text-center">
                            {smsTimer !== 0 ? `Resend SMS in ${smsTimer}s` : 'Resend SMS'} 
                        </Text>
                    </View>
                </Pressable>
                
                {/* submit auth button */}
                <View className="flex-1 justify-end mb-28">
                    <AuthButton
                    onPress={submitCode}
                    text="Submit"
                    bgColor="#ADB3C1"
                    shadowColor="#DFE3EC"
                    disabled={otpCode.length == 0 ? true : false}/>
                </View>
            </View>
        </ScrollView>
    )
}

export default VerifyPhone


const styles = StyleSheet.create({
    container: {
        width: "80%",
    },
    pinCodeContainer: {
        borderBottomWidth: 3,
        borderBottomColor: '#DFE3EC',
        borderColor: 'transparent',
        borderRadius: 2,
    },
    focusedPinCodeContainer: {
        borderBottomWidth: 3,
        borderBottomColor: '#DFE3EC',
        borderColor: 'transparent',
        borderRadius: 2,
    },
    focusStick: {
        backgroundColor: 'transparent',
        height: 0,
    },
    pinCodeText: {
        font: "WorkSans-SemiBold",
        color: "#ADC7FF",
        fontSize: 48,
    }
});
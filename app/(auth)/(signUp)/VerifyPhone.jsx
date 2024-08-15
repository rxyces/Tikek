import { View, Text, Keyboard, StyleSheet, Pressable, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect } from 'react';
import { OtpInput } from "react-native-otp-entry";
import { supabase } from '../../../lib/supabase';

import AuthButton from '../../../components/AuthButton';
import Error from '../../../components/Error';
import { useSignUpContext } from '../../../context/SignUpContext';
import { useAuthContext } from '../../../context/Auth';

const VerifyPhone = () => {
    // contexts
    const { formattedPhoneNum } = useSignUpContext()
    const { setIsAuthenticated } = useAuthContext()

    const [smsTimer, setSmsTimer] = useState(0);
    const [clock, setClock ] = useState()
    const [otpCode, setOtpCode] = useState("");
    const [errorText, setErrorText] = useState("");

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

    //supabase resend code
    const resendCode = async () => {
        const { error } = await supabase.auth.resend({
            type: "sms",
            phone: formattedPhoneNum
        })
        if (!error) {
            setErrorText("")
            startTimer()
        }
        else {
            switch (error.code) {
                case "over_sms_send_rate_limit":
                    setErrorText("Please wait 60s to receive your code")
                    break
                case "over_request_rate_limit":
                    setErrorText("Too many requests, try again later")
                    break
                default:
                    console.error(JSON.stringify(error, null, 2))
                    setErrorText("Unexpected error, please try again later")
                    break
            }
        }
    }

    //supabase submit code
    const submitCode = async () => {
        setErrorText("")
        const { data, error } = await supabase.auth.verifyOtp({
            phone: formattedPhoneNum, 
            token: otpCode,
            type: 'sms'
        });
        if (!error) {
            setIsAuthenticated(true)
            router.replace("/")
        }
        else {
            switch (error.code) {
                case "otp_expired":
                    setErrorText("Code expired, please try again")
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
            <View className="flex-1 items-center mt-2">
                
                {/* text at the top */}
                <Text className="font-wsemibold text-white text-[30px]">
                    Verify phone number
                </Text>
                <View className="max-w-[250px] mt-2">
                    <Text className="font-wregular text-[#ADB3C1] text-[16px] text-center">
                        Please enter the 4 digit code sent to
                        <Text className="font-wsemibold text-[#C1BBF6] text-[16px] text-center">
                            {" " + formattedPhoneNum}
                        </Text>
                    </Text>
                </View>
                
                {/* error above the otp input code */}
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
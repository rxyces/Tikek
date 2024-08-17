import { View, Text, Pressable, ScrollView, TextInput } from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

import AuthButton from '../../../components/AuthButton';
import Error from '../../../components/Error';
import PasswordIcon from "../../../assets/svgs/password_icon.svg"
import PasswordStrengthMeter from '../../../components/PasswordStrengthMeter'
import { asyncStorage } from '../../../context/Store';
import { useAuthContext } from '../../../context/Auth';

const resetKey = "RESETPASSWORD"

const ResetPassword = () => {
    const { setIsAuthenticated } = useAuthContext()

    //states
    const [errorText, setErrorText] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [secureText, setSecureText] = useState(true);
    const [confirmSecureText, setConfirmSecureText] = useState(true);
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    //add on storage state that user is authed and attempting to reset pw
    useEffect(() => {
        const savePasswordState = async () => {
            await asyncStorage.setItem(resetKey, "true")
        }
        savePasswordState()
    }, [])

    const handleResetPassword = async () => {
        if (newPassword != confirmNewPassword) {
            setErrorText("Passwords do not match")
        }
        else if (passwordStrength != 5) {
            setErrorText("Weak password, try again")
        }
        else {
            setErrorText("")
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            })
            if (!error) {
                //successfully updated password return back to root so user can get properly routed
                await asyncStorage.removeItem(resetKey) //remove reset pw state
                setIsAuthenticated(true)
                router.replace("/")
            }
            switch (error.code) {
                case "weak_password":
                    setErrorText("Weak password, try again")
                    break
                case "same_password":
                    setErrorText("Passwords cannot be reused, try again")
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
                    Reset password
                </Text>
                <View className="max-w-[250px] mt-2">
                    <Text className="font-wregular text-[#ADB3C1] text-[16px] text-center">
                        Enter a new password below
                    </Text>
                </View>

                {/* input forms container */}
                <View className="space-y-8 mt-16">

                    {/* new password input container */}
                    <View>
                        <View className="w-[340px] h-[50px] rounded-2xl bg-[#2B2E34] items-center flex-row" style={newPassword == "" ? {opacity: 0.7} : {}}>
                            <View className="w-5/6 flex-row">
                                <View className="ml-4">
                                    <PasswordIcon width={23} height={23}/>
                                </View>
                                <TextInput
                                onChangeText={(text) => {setNewPassword(text)}}
                                value={newPassword}
                                placeholder='New password'
                                keyboardType='default'
                                autoComplete='off'
                                secureTextEntry={secureText}
                                placeholderTextColor="#DFE3EC"
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

                    {/*confirm new password input container */}
                    <View>
                        <View className="w-[340px] h-[50px] rounded-2xl bg-[#2B2E34] items-center flex-row" style={confirmNewPassword == "" ? {opacity: 0.7} : {}}>
                            <View className="w-5/6 flex-row">
                                <View className="ml-4">
                                    <PasswordIcon width={23} height={23}/>
                                </View>
                                <TextInput
                                onChangeText={(text) => {setConfirmNewPassword(text)}}
                                value={confirmNewPassword}
                                placeholder='Confirm password'
                                keyboardType='default'
                                autoComplete='off'
                                secureTextEntry={confirmSecureText}
                                onSubmitEditing={handleResetPassword}
                                placeholderTextColor="#DFE3EC"
                                className="font-wsemibold text-[20px] text-[#DFE3EC] pl-2 pr-12 w-full h-full"/>
                            </View>

                            {/* show password button */}
                            <Pressable
                            style={({pressed}) => ({opacity: pressed ? 0.8 : 1})}
                            onPress={() => setConfirmSecureText(!confirmSecureText)}
                            >
                                <Text className="font-wregular text-[16px] text-[#C1BBF6] underline">
                                    {confirmSecureText ? "show" : "hide"}
                                </Text>
                            </Pressable>
                        </View>

                        {/* password strength meter */}
                        <View className="mt-4 items-center">
                            <PasswordStrengthMeter password={newPassword} passwordStrength={passwordStrength} setPasswordStrength={setPasswordStrength}/>
                        </View>
                    </View>
                </View>

                {/* submit auth button */}
                <View className="flex-1 justify-end mb-28">
                    <Error errorText={errorText}/>
                    <AuthButton
                    onPress={handleResetPassword}
                    text="Reset password"
                    bgColor="#791DF3"
                    shadowColor="#8983F3"
                    disabled={passwordStrength !== 5 ? true : false}/>
                </View>

            </View>
        </ScrollView>
    )
}

export default ResetPassword
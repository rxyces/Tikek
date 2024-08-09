import { View, Text, ScrollView, TextInput, Pressable } from 'react-native'
import { useState } from 'react'
import { useSignUp } from '@clerk/clerk-expo'
import { router } from 'expo-router'

import { useSignUpContext } from '../../../context/SignUpContext'
import { tokenCache } from '../../../context/TokenCache'
import EmailIcon from "../../../assets/svgs/email_icon.svg"
import NameIcon from "../../../assets/svgs/name_icon.svg"
import PasswordIcon from "../../../assets/svgs/password_icon.svg"
import PasswordStrengthMeter from '../../../components/PasswordStrengthMeter'
import AuthButton from '../../../components/AuthButton'
import Error from '../../../components/Error'

const AccountDetails = () => {
    const { emailAddress, setEmailAddress, formattedPhoneNum, fullName, setFullName, password, setPassword } = useSignUpContext()
    const [secureText, setSecureText] = useState(true);
    const [errorText, setErrorText] = useState("");
    const { signUp, setActive } = useSignUp()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // finish creating account with clerk
    const handleFormSubmit = async () => {
        // test if email is even valid
        if (!emailRegex.test(emailAddress)) {
            setErrorText("Invalid email, try again")
        }

        // make sure the name is actually entered 
        else if (fullName.trim().split(/\s+/).length < 2 ){
            setErrorText("Full name must consist of first name and last name")
        }
        else {
            setErrorText("")
            const nameParts = fullName.trim().split(/\s+/)

            // submit full details to clerk
            try {
                await signUp.update({
                    emailAddress: emailAddress,
                    password: password,
                    firstName: nameParts[0],
                    lastName: nameParts[nameParts.length - 1],
                })

                if (signUp.status === "complete") {
                    // save session to device
                    await setActive({ session: signUp.createdSessionId })

                    // save user settings to device
                    const userSettings = {
                        "formattedPhoneNum": formattedPhoneNum,
                        "emailAddress": emailAddress,
                        "fullName": fullName,
                    }
                    await tokenCache.saveToken("userSettings", JSON.stringify(userSettings))
                    
                    // proceed to find city page
                    router.dismissAll()
                    router.replace("/FindCity")
                }
                else {
                    console.error(JSON.stringify(signUp, null, 2))
                    setErrorText("Unexpected error, please try again later")
                }
            } catch (error) {
                switch (error.errors[0].code) {
                    case "form_password_pwned":
                        setErrorText("Password has been found in a data breach, try again using a different password")
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

                {/* text at the top */}
                <Text className="font-wsemibold text-white text-[30px]">
                    Create an account
                </Text>
                <View className="max-w-[250px] mt-2">
                    <Text className="font-wregular text-[#ADB3C1] text-[16px] text-center">
                        Just a few details to get you started
                    </Text>
                </View>
                
                {/* input forms container */}
                <View className="space-y-8 mt-10">

                    {/* full name input */}
                    <View className="w-[340px] h-[50px] rounded-2xl bg-[#2B2E34] items-center flex-row" style={fullName == "" ? {opacity: 0.7} : {}}>
                        <View className="ml-4">
                            <NameIcon width={23} height={23}/>
                        </View>
                        <TextInput
                        onChangeText={(text) => setFullName(text)}
                        value={fullName}
                        autoFocus
                        placeholder='Full name'
                        keyboardType='default'
                        autoComplete='name'
                        placeholderTextColor="#DFE3EC"
                        className="font-wsemibold text-[20px] text-[#DFE3EC] pl-2 pr-12 w-full h-full"/>
                    </View>

                    {/* email input */}
                    <View className="w-[340px] h-[50px] rounded-2xl bg-[#2B2E34] items-center flex-row" style={emailAddress == "" ? {opacity: 0.7} : {}}>
                        <View className="ml-4">
                            <EmailIcon width={23} height={23}/>
                        </View>
                        <TextInput
                        onChangeText={(text) => setEmailAddress(text)}
                        value={emailAddress}
                        placeholder='Email'
                        keyboardType='email-address'
                        autoComplete='email'
                        placeholderTextColor="#DFE3EC"
                        className="font-wsemibold text-[20px] text-[#DFE3EC] pl-2 pr-12 w-full h-full"/>
                    </View>
                    
                    {/* password input container */}
                    <View>
                        <View className="w-[340px] h-[50px] rounded-2xl bg-[#2B2E34] items-center flex-row" style={password == "" ? {opacity: 0.7} : {}}>
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

                        {/* password strength meter */}
                        <View className="mt-4 items-center">
                            <PasswordStrengthMeter password={password}/>
                        </View>
                    </View>

                </View>
                
                {/* submit button and terms at the bottom */}
                <View className="flex-1 justify-end mb-12 items-center">
                    <Error errorText={errorText}/>
                    <AuthButton
                        onPress={handleFormSubmit}
                        text="Sign up"
                        bgColor="#791DF3"
                        shadowColor="#8983F3"
                        disabled={fullName.length == 0 || emailAddress.length == 0 || password.length == 0 ? true : false}/>
                    <Text className="text-center font-wregular text-[12px] text-[#60697B] max-w-[240px] mt-8">
                        By continuing you're indicating that you accept our
                        <Text className="text-[#C1BBF6] underline">
                            {" Terms of Use"}
                        </Text>
                        <Text >
                            {" and our"}
                        </Text>
                        <Text className="text-[#C1BBF6] underline">
                            {" Privacy Policy"}
                        </Text>
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default AccountDetails
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native'
import { Image } from 'expo-image';
import { router } from 'expo-router'
import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-expo'

import CountryModal from '../../../components/CountryModal';
import DownSelector from '../../../assets/svgs/down_selector.svg'
import AuthButton from '../../../components/AuthButton';
import Error from '../../../components/Error';
import { useSignUpContext } from '../../../context/SignUpContext'

const EnterPhone = () => {
    //load crowd background image
    const source = require("../../../assets/images/crowd_background_image.png");

    //define error and modal states
    const [errorText, setErrorText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const onModalInteraction = () => setIsModalVisible(!isModalVisible)

    //sign up data context and clerk sign up object used to initiate sign up
    const { phoneNum, setPhoneNum, selectedCountryNumber, setSelectedCountryNumber, formattedPhoneNum, setFormattedPhoneNum } = useSignUpContext();
    const { signUp } = useSignUp()

    //process submitting phone num
    const onPress = async () => {
        //show error if phone num isnt in the required clerk format
        if (phoneNum.replace(/\s+/g, '').length < 7 || phoneNum.replace(/\s+/g, '').length > 15) {
            setErrorText("Invalid phone number")
        }
        else {
            setErrorText("")
            try {
                //initate sms sign up clerk
                await signUp.create({
                    phoneNumber: formattedPhoneNum,
                })
                
                //send sms message
                await signUp.preparePhoneNumberVerification()
                setErrorText("")
                router.push("/VerifyPhone")
    
            } catch (error) {
                switch (error.errors[0].code) {
                    case "phone_number_exists_code":
                        setErrorText("Phone number already exists")
                        break
                    case "form_identifier_exists":
                        setErrorText("Phone number already exists")
                        break
                    case "unsupported_country_code":
                        setErrorText("This country code is not currecntly supported")
                        break
                    case "form_param_format_invalid":
                        setErrorText("Invalid phone number")
                        break
                    default:
                        console.error(JSON.stringify(error, null, 2))
                        setErrorText("Unexpected error, please try again later")
                        break
                }
            }
        }
        
    }

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

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View className="flex-1 items-center mt-4">

                {/* background image */}
                <View className="h-[135px] w-full">
                    <Image
                    className="flex-1"
                    source={source}
                    contentFit="cover"
                    />
                </View>
                
                {/* sign up text */}
                <View className="items-center mt-10 space-y-4">
                    <Text className="font-wsemibold text-[30px] text-white">
                        Sign up to Qswap
                    </Text>
                    <Text className="font-wregular text-[16px] text-[#DFE3EC]">
                        Buy. Sell. Experience.
                    </Text>
                </View>

                {/* country code button and enter phone num field */}
                <View className="mt-16 flex-row w-5/6 justify-between">
                    {/* when pressed display modal for picking country code */}
                    <Pressable
                    onPress={onModalInteraction}
                    style={({pressed}) => ({opacity: pressed ? 0.8 : 1})}>
                        <View className="flex-row bg-[#2B2E34] w-[105px] h-[55px] rounded-2xl items-center justify-between px-3">
                            <View className="min-w-[50px] w-[50px] justify-center items-center">
                                <Text className="text-[#ADB3C1] font-wregular text-[20px]">
                                    {selectedCountryNumber}
                                </Text>
                            </View>
                            <DownSelector width={22} height={22}/>
                        </View>
                    </Pressable>
                    
                    <View className="w-[210px] h-[55px] rounded-2xl bg-[#2B2E34] justify-center items-center">
                        <TextInput
                        onChangeText={onEnterPhoneNum}
                        value={phoneNum}
                        placeholder='Phone number'
                        keyboardType='numeric'
                        autoComplete='tel'
                        placeholderTextColor="#ADB3C1"
                        className="font-wregular text-[20px] text-[#C1BBF6] px-2 text-center w-full h-full"
                        maxLength={15}
                        autoFocus
                        onSubmitEditing={onPress}
                        />
                    </View>
                </View>
                <Error errorText={errorText}/>
                <View className="flex-1 justify-end mb-28">
                    <AuthButton
                    onPress={onPress}
                    text="Continue"
                    bgColor="#ADB3C1"
                    shadowColor="#DFE3EC"
                    disabled={phoneNum.length == 0 ? true : false}/>
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

export default EnterPhone
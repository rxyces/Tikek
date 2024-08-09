import { View, Text, Pressable } from 'react-native'
import CountryFlag from "react-native-country-flag";


//button to select country code
const CountryButton = ({ countryCode, country, countryNumber, setSelectedCountryNumber, onModalInteraction }) => {

    const onCountryPress = () => {
        setSelectedCountryNumber(countryNumber)
        onModalInteraction()
    }

    return (
        <Pressable
        onPress={onCountryPress}
        style={({pressed}) => ({opacity: pressed ? 0.8 : 1})}>
            <View className="flex-row items-center px-4 bg-[#2B2E34] rounded-2xl min-h-[55px] justify-center max-w-5/6 w-5/6">
                <CountryFlag isoCode={countryCode} size={20} />
                <Text className="font-wregular text-[#DFE3EC] text-[20px] ml-4">
                    {country}
                </Text>
                <Text className="font-wregular text-[#C6D8FF] text-[20px] ml-auto">
                    {"(" + countryNumber + ")"}
                </Text>
            </View>
        </Pressable>
    )
}

export default CountryButton
import { Pressable, Modal, View, ScrollView } from 'react-native';

import ExitButton from "../assets/svgs/exit_button.svg"
import CountryButton from './CountryButton';


const countryData = [
    { code: 'gb', name: 'United Kingdom', number: '+44' },
    { code: 'us', name: 'United States', number: '+1' },
    { code: 'es', name: 'Spain', number: '+34' },
    { code: 'gr', name: 'Greece', number: '+30' },
    { code: 'bg', name: 'Bulgaria', number: '+359' },
    { code: 'cy', name: 'Cyprus', number: '+357' },
    { code: 'br', name: 'Brazil', number: '+55' },
    { code: 'th', name: 'Thailand', number: '+66' },
    { code: 'nl', name: 'Netherlands', number: '+31' },
    { code: 'mx', name: 'Mexico', number: '+52' },
    { code: 'de', name: 'Germany', number: '+49' },
    { code: 'hr', name: 'Croatia', number: '+385' },
    { code: 'do', name: 'Dominican Republic', number: '+1' },
    { code: 'ca', name: 'Canada', number: '+1' },
    { code: 'pl', name: 'Poland', number: '+48' },
    { code: 'tz', name: 'Tanzania', number: '+255' },
    { code: 'pr', name: 'Puerto Rico', number: '+1' },
    { code: 'tw', name: 'Taiwan', number: '+886' },
    { code: 'jm', name: 'Jamaica', number: '+1' },
    { code: 'au', name: 'Australia', number: '+61' },
    { code: 'ar', name: 'Argentina', number: '+54' },
    { code: 'is', name: 'Iceland', number: '+354' },
    { code: 'hu', name: 'Hungary', number: '+36' },
    { code: 'cl', name: 'Chile', number: '+56' },
    { code: 'mc', name: 'Monaco', number: '+377' },
];

//modal for showing all country code options
const CountryModal = ( { onModalInteraction, isModalVisible, setSelectedCountryNumber, setSelectedCountry }) => {
    return (
        <Modal
        animationType='slide'
        visible={isModalVisible}
        transparent={true}
        >   
            <View className="bg-[#1E1E24] flex-1 top-[6%] h-[6%] rounded-2xl border-t border-[#A191FC]">
                <View className="items-end m-6">
                    {/* exit button */}
                    <Pressable 
                        onPress={onModalInteraction} 
                        style={({pressed}) => ({opacity: pressed ? 0.8 : 1})}>
                            <View className="px-28 -mx-28">
                                <ExitButton width={30} height={30}/>
                            </View>
                    </Pressable>
                </View>
                <ScrollView className="mt-8" contentContainerStyle={{ flexGrow: 1, alignItems: 'center', gap: 24 }}>
                    {countryData.map(country => (
                        <CountryButton
                        key={country.code}
                        countryCode={country.code} 
                        country={country.name} 
                        countryNumber={country.number} 
                        setSelectedCountryNumber={setSelectedCountryNumber} 
                        setSelectedCountry={setSelectedCountry} 
                        onModalInteraction={onModalInteraction}/>
                    ))}
                    <View className="my-10"/>
                </ScrollView>
            </View>
            
        </Modal>
    )
}

export default CountryModal


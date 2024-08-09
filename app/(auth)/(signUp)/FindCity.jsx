import { View, Text, FlatList, Pressable, TextInput } from 'react-native'
import { useState } from 'react'
import { useClerk } from '@clerk/clerk-expo'
import { router } from 'expo-router'

import { tokenCache } from '../../../context/TokenCache'
import Error, { errorCleanup } from '../../../components/Error'
import SearchIcon from "../../../assets/svgs/search_icon.svg"
import AuthButton from '../../../components/AuthButton'

const CITYDATA = [
    {
    id: "1",
    title: "London, UK"
    },
    {
    id: "2",
    title: "New York City, NY"
    },
    {
    id: "3",
    title: "Miami, FL"
    },
    {
    id: "4",
    title: "San Francisco, CA"
    },
    {
    id: "5",
    title: "Los Angeles, CA" 
    },
    {
    id: "6",
    title: "Berlin, DE"
    },
    {
    id: "7",
    title: "Prague, CZ"
    },
    {
    id: "8",
    title: "Manchester, UK" 
    },
    {
    id: "9",
    title: "Chicago, IL" 
    },
    {
    id: "10",
    title: "Seattle, WA" 
    },
    {
    id: "11",
    title: "Las Vegas, NV" 
    },
    {
    id: "12",
    title: "Athens, GA" 
    },
    {
    id: "13",
    title: "Brighton, UK" 
    },
    {
    id: "14",
    title: "Liverpool, UK" 
    },
];


const FindCity = () => {
    const [search, setSearch] = useState("")
    const [selectedCity, setSelectedCity] = useState("")
    const [filteredCities, setFilteredCities] = useState(CITYDATA)
    const [errorText, setErrorText] = useState("")
    const { signOut } = useClerk()


    //each city component
    const City = ({ title }) => {
        const backgroundColor = title == selectedCity ? "#C1BBF6" : "transparent";
        const font = title == selectedCity ? "WorkSans-SemiBold" : "WorkSans-Regular";
        return (
            <Pressable
            onPress={() => setSelectedCity(title)}
            className="flex-row items-center my-4"
            hitSlop={16}>
                <View 
                    className="w-[15px] h-[15px] rounded-full border-2 border-[#C1BBF6] mr-2" 
                    style={{ backgroundColor: backgroundColor}}
                />
                <Text 
                    className="font-wregular text-[20px] text-[#EEF0F4]"
                    style={{ fontFamily: font}}>
                    {title}
                </Text>
            </Pressable>
        )
    }

    //search func
    const handleSearch = (text) => {
        setSearch(text)
        const filtered = CITYDATA.filter(city => city.title.toLowerCase().includes(text.toLowerCase()))
        setFilteredCities(filtered)
    }

    // handle finish button press
    const handleFinish = async () => {
        //make sure a city is even selected
        if (!selectedCity) {
            setErrorText("You must select a city to continue");
        }
        else {
            setErrorText("")
            try {
                const existingSettingsString = await tokenCache.getToken("userSettings");
                
                //check the previous step (sign up) has been completed by having user settings already saved
                if (existingSettingsString) {
                    const existingSettings = JSON.parse(existingSettingsString);
                
                    const updatedSettings = {
                        ...existingSettings,
                        city: selectedCity
                    };
                    
                
                    // Save the updated settings back to SecureStore
                    await tokenCache.saveToken("userSettings", JSON.stringify(updatedSettings));
                    if (router.canDismiss())
                        router.dismissAll()
                    router.replace("/")
                } else {
                    setErrorText("User settings do not exist, restart the sign in process");
                    await errorCleanup(signOut)

                }
            } catch (error) {
                console.error("Error updating user settings:", error);
            }
            }
        }

    return (
        // text at top
        <View className="flex-1 items-center mt-4">  
            <Text className="font-wsemibold text-white text-[30px]">
                Find your city
            </Text>
            <View className="max-w-[250px] mt-2">
                <Text className="font-wregular text-[#ADB3C1] text-[16px] text-center">
                    Select your city to discover local events
                </Text>
            </View>

            {/* search bar */}
            <View className="w-[340px] h-[50px] rounded-2xl bg-[#2B2E34] items-center flex-row mt-8">
                <View className="ml-4">
                    <SearchIcon width={25} height={25}/>
                </View>
                <TextInput
                onChangeText={handleSearch}
                value={search}
                placeholder='Search'
                autoComplete='off'
                placeholderTextColor="#DFE3EC"
                className="font-wsemibold text-[20px] text-[#DFE3EC] pl-2 pr-12 w-full h-full"/>
            </View>

            {/* scrollable list of all the cities */}
            <FlatList
            data={filteredCities}
            renderItem={({item}) => <City title={item.title}/>}
            keyExtractor={item => item.id}
            className="mt-10 min-w-[270px] max-h-[400px] border-b-2 border-[#EEF0F4]"
            />
            
            {/* finish up button at the bottom along with the error */}
            <View className={`flex-1 justify-end items-center ${errorText ? "mb-16" : "mb-28"}`}>
                <AuthButton
                    onPress={handleFinish}
                    text="Finish up"
                    bgColor="#791DF3"
                    shadowColor="#8983F3"
                    disabled={selectedCity ? false : true}/>
                <Error errorText={errorText}/>
            </View>
            
        </View>
    )
}

export default FindCity
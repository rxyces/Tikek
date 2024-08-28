import { View, Text, Pressable, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl, ActivityIndicator  } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { router } from 'expo-router'
import { useEffect, useState, useCallback } from 'react'
import Animated, { 
    FadeInUp, 
    FadeOutUp,
    Easing,
    FadeIn,
    FadeOut,
    LinearTransition,
} from 'react-native-reanimated';

import { asyncStorage } from '../../../context/Store'
import FeaturedCarousel from '../../../components/FeaturedCarousel'
import EventCategoryCarousel from '../../../components/EventCategoryCarousel';
import FilterIcon from "../../../assets/svgs/filter_icon.svg"
import UpSelector from "../../../assets/svgs/up_selector.svg"
import TonightIcon from "../../../assets/svgs/tonight_icon.svg"
import PopularIcon from "../../../assets/svgs/popular_icon.svg"
import CheapIcon from "../../../assets/svgs/cheap_icon.svg"



const Home = () => {
    // states
    const [showFilters, setShowFilters] = useState(false)
    const [city, setCity] = useState("-----") // default value while city hasnt loaded yet
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0)
    

    // updates the city state when page loads
    useEffect(() => {
        const getCity = async () => {
            asyncStorage.getItem("userCity").then(city => {
                if (city) setCity(city)
            })
        }
        getCity()
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            setRefreshKey(prevKey => prevKey + 1)
        }, 500);
    }, []);

    return (
        <SafeAreaView>
            <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }>
            {/* show spinner if refreshing */}
            {refreshing && (
            <Animated.View layout={LinearTransition} className="flex-row justify-center items-center mt-4">
                <ActivityIndicator size="large" color="#C6D8FF" />
            </Animated.View>
            )} 
                <Animated.View layout={LinearTransition} className="flex-1 items-center mt-4">

                    {/* city text at the top */}
                    <View className="flex-row w-5/6 border-b-2 border-[#C6D8FF] items-end pb-1 justify-between">
                        <Text className="font-wmedmium text-white text-[24px]">
                            {city}
                        </Text>

                        <Pressable
                            style={({ pressed }) => [
                                { opacity: pressed ? 0.8 : 1 },
                                { paddingHorizontal: 64, paddingVertical: 16, marginHorizontal: -64, marginVertical: -16 },
                            ]}
                            onPress={() => {}}
                            >
                            <Text className="font-wregular text-[16px] text-[#DFE3EC]">
                                Change city
                            </Text>
                        </Pressable>
                    </View>

                    {/* filter toggle*/}
                    <View className="w-5/6 mt-6">
                        <Pressable
                            style={({ pressed }) => [
                                { opacity: pressed ? 0.8 : 1 },
                                { paddingHorizontal: 64, paddingVertical: 16, marginHorizontal: -64, marginVertical: -16 },
                            ]}
                            onPress={() => setShowFilters(!showFilters)}
                            >
                            {showFilters && 
                                <Animated.View entering={FadeIn.duration(200).easing(Easing.ease)} exiting={FadeOut.duration(200).easing(Easing.ease)}>
                                    <View className="items-center">
                                        <UpSelector width={24} height={24} />
                                    </View>
                                </Animated.View>
                            }
                            {!showFilters &&
                                <Animated.View entering={FadeIn.duration(200).easing(Easing.ease)} exiting={FadeOut.duration(200).easing(Easing.ease)}>
                                    <View className="flex-row space-x-2 items-center">
                                        <FilterIcon width={24} height={24} />
                                        <Text className="font-wregular text-[20px] text-[#DFE3EC]">
                                            Filters
                                        </Text>
                                    </View>
                                </Animated.View>
                            }
                        </Pressable>
                    </View>

                    
                    {/* filters */}
                    {showFilters &&
                        <Animated.View entering={FadeInUp.duration(200).easing(Easing.ease)} exiting={FadeOutUp.duration(200).easing(Easing.ease)}>
                        <View className="flex-row space-x-6 mt-4">
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {}}
                                >
                                <View className="flex-row space-x-2 items-center">
                                    <TonightIcon width={30} height={30} />
                                    <Text className="font-wmedium text-[20px] text-[#DFE3EC]">
                                        Tonight
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {}}
                                >
                                <View className="flex-row space-x-2 items-center">
                                    <PopularIcon width={30} height={30} />
                                    <Text className="font-wmedium text-[20px] text-[#DFE3EC]">
                                        Popular
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {}}
                                >
                                <View className="flex-row space-x-2 items-center">
                                    <CheapIcon width={30} height={30} />
                                    <Text className="font-wmedium text-[20px] text-[#DFE3EC]">
                                        Cheap
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        </Animated.View>
                    }
                
                    <Animated.View layout={LinearTransition} className="mt-6">
                        <FeaturedCarousel key={refreshKey}/>
                    </Animated.View>
                    
                    <Animated.View layout={LinearTransition} className="mt-6 w-5/6 items-start">
                        <EventCategoryCarousel key={refreshKey} categoryTitle={"popular"}/>
                    </Animated.View>
                
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default Home
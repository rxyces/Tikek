import { View, Text, ScrollView } from 'react-native'
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { format } from "date-fns"

import Error from './Error';
import { getRecordsByDB } from '../utils/dataRetrieval';
import { useAuthenticatedContext } from '../context/AuthenticatedContext';

const EventCategoryCarousel = ({ categoryTitle }) => {
    //states
    const [isLoading, setIsLoading] = useState(true)
    const [errorText, setErrorText] = useState("")
    const [eventData, setEventData] = useState(null)

    //context
    const { setAllEventData } = useAuthenticatedContext()

    //loading image
    const source = require("../assets/images/loading_placeholder.png")

    useEffect(() => {
        setErrorText("")
        getRecordsByDB({ dbName: categoryTitle }).then(({data, error}) => {
            if (!error) {
                setEventData(data)
                //set unique data to the state basically acting as cache for all event data retrieved
                setAllEventData(prevData => {
                    const uniqueNewData = data.filter(item => !prevData.some(existingItem => existingItem.id == item.id))
                    return [...prevData, ...uniqueNewData]
                });
            }
            else {
                setErrorText(error)
            }
            
            setIsLoading(false)
        }
        )
    }, [])

    const carouselItem = ({item}) => {
        return (
        <View className="w-[150px]">
            <View className="h-[100px]">
                <Image
                className="flex-1 rounded-xl"
                source={item.image}
                contentFit="cover"
                placeholder={source}
                />
            </View>
            <Text className="font-wsemibold text-[16px] text-[#DFE3EC] mt-2" numberOfLines={2} ellipsizeMode='tail'>
                {item.title}
            </Text>
            <View className="flex-row gap-2 flex-nowrap mt-0">
                <Text className="font-wregular text-[16px] text-[#C1C8D7]">
                    {format(new Date(item.date), 'MMM, do')}
                </Text>
                <View className="flex-1">
                    <Text className="font-wregular text-[16px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                        {item.location}
                    </Text>
                </View>
            </View>
            <Text className="font-wregular text-[16px] text-[#C1BBF6]" numberOfLines={1} ellipsizeMode='tail'>
                From £999
            </Text>
        </View>
        );
    }

    if (errorText)  {
        return (
            <View className="min-w-[83.3%]">
                <Text className="font-wregular text-[20px] text-[#DFE3EC]">
                    {categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1)}
                </Text>
                <View className="items-start">
                    <Error errorText={errorText}/>
                </View>
            </View>
        )
    }
    else if (isLoading) {
        return (
            <View className="min-w-[83.3%]">
                <Text className="font-wregular text-[20px] text-[#DFE3EC]">
                    {categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1)}
                </Text>
                <Text className="font-wmedium text-[16px] text-[#C1C8D7] mt-4">
                    Load already pls
                </Text>
            </View>
        )
    } 
    else {
        return (
            <View className="min-w-[83.3%]">
                <Text className="font-wregular text-[20px] text-[#DFE3EC]">
                    {categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1)}
                </Text>
    
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="mt-4 flex-row space-x-8">
                    {eventData.map((item, index) => (
                    <View key={index}>
                        {carouselItem({ item })} 
                    </View>
                    ))}
                </ScrollView>
            </View>
        )
    }
}

export default EventCategoryCarousel
import { View, Text, ScrollView } from 'react-native'
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { format } from "date-fns"

import Error from './Error';
import { getRecords } from '../utils/dataRetrieval';


const EventCategoryCarousel = ({ categoryTitle }) => {
    //states
    const [isLoading, setIsLoading] = useState(true)
    const [errorText, setErrorText] = useState("")
    const [eventData, setEventData] = useState(null)

    //loading image
    const source = require("../assets/images/loading_placeholder.png")

    useEffect(() => {
        setErrorText("")
        getRecords({ dbName: categoryTitle }).then(({data, error}) => {
            if (!error) {
                setEventData(data)
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

    return (
        <View className="min-w-5/6 flex-1">
            <Text className="font-wregular text-[20px] text-[#DFE3EC]">
                {categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1)}
            </Text>

            {errorText ? 
            <Error errorText={errorText}/> : isLoading ? "" : (
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="mt-4 flex-row space-x-8">
                {eventData.map((item, index) => (
                <View key={index}>
                    {carouselItem({ item })} 
                </View>
                ))}
            </ScrollView>)}


        </View>
    )
}

export default EventCategoryCarousel
import { View, Text, ScrollView } from 'react-native'
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { format } from "date-fns"
import { useQuery } from '@tanstack/react-query'

import Error from './Error';
import { getEventDataByCategory } from '../utils/dataRetrieval';
import { useAuthenticatedContext } from '../context/AuthenticatedContext';

const EventCategoryCarousel = ({ categoryTitle }) => {
    //context
    const { setAllEventData } = useAuthenticatedContext()

    //loading image
    const source = require("../assets/images/loading_placeholder.png")

    const { data, isLoading, error } = useQuery({
        queryKey: ["category", categoryTitle],
        queryFn: () => getEventDataByCategory(categoryTitle),
        staleTime: 3 * 60 * 1000,
        refetchInterval: 300000,
    });

    useEffect(() => {
        if (data) {
            setAllEventData(prevData => {
                //updates any returned ids and new ids into the context
                const updatedData = [...prevData]
                data.forEach(newItem => {
                    const existingIndex = updatedData.findIndex(item => item.id === newItem.id);
                    if (existingIndex !== -1) {
                        updatedData[existingIndex] = newItem
                    } 
                    else {
                        updatedData.push(newItem)
                    }
                })
                return updatedData
            })
        }
    }, [data, error])

    const generateDisplayPrice = (ticket_types) => {
        const allAskPrices = ticket_types.flatMap(ticketType => ticketType.user_asks).map(ask => parseFloat(ask.price))
        if (allAskPrices.length > 0) {
            return "From £" + Math.min(...allAskPrices)
        }
        else {
            return "From £"
        }
    }

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
                {generateDisplayPrice(item.ticket_types)}
            </Text>
        </View>
        );
    }

    if (error)  {
        return (
            <View className="min-w-[83.3%]">
                <Text className="font-wregular text-[20px] text-[#DFE3EC]">
                    {categoryTitle}
                </Text>
                <View className="items-start">
                    <Error errorText={error}/>
                </View>
            </View>
        )
    }
    else if (isLoading) {
        return (
            <View className="min-w-[83.3%]">
                <Text className="font-wregular text-[20px] text-[#DFE3EC]">
                    {categoryTitle}
                </Text>
                <Text className="font-wmedium text-[16px] text-[#C1C8D7] mt-4">
                    Load already pls
                </Text>
            </View>
        )
    } 
    else {
        return (
            <View className="w-full ml-[16.666667%]">
                <Text className="font-wregular text-[20px] text-[#DFE3EC]">
                    {categoryTitle}
                </Text>
    
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="mt-4 flex-row space-x-4">
                    {data.map((item, index) => (
                    <View key={index}>
                        {carouselItem({ item })} 
                    </View>
                    ))}
                    {/* empty container at the end */}
                    <View className="min-w-[75px] min-h-[100px]"/>
                </ScrollView>
            </View>
        )
    }
}

export default EventCategoryCarousel
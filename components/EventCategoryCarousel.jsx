import { View, Text, ScrollView, Pressable } from 'react-native'
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { format } from "date-fns"
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router';

import Error from './Error';
import { eventSelectors } from "../stores/authenticatedSelectors"
import { useEventStore, useTicketStore } from "../stores/authenticatedStore"
import { getEventDataByCategory } from '../utils/dataRetrieval';

const onPress = (itemId) => {
    router.push({pathname:`/events/${itemId}`})
}

const EventCategoryCarousel = ({ categoryTitle }) => {
    //states
    const [isLoading, setIsLoading] = useState(true)
    const [eventIds, setEventIds] = useState([])

    //loading image
    const source = require("../assets/images/loading_placeholder.png")

    const { data, error } = useQuery({
        queryKey: ["category", categoryTitle],
        queryFn: () => getEventDataByCategory(categoryTitle),
        staleTime: 3 * 60 * 1000,
        refetchInterval: 300000,
        refetchOnMount: "always",
    });

    const addEvent = useEventStore((state) => state.addEvent)
    const addTicket = useTicketStore((state) => state.addTicket)
    const events = useEventStore((state) => eventSelectors.getEventsByIds(eventIds)(state))

    useEffect(() => {
        setIsLoading(true)
        if (data) {
            data.forEach(newItem => {
                addEvent(newItem)
                newItem.ticket_types.forEach(newTicket => {
                    addTicket(newTicket)
                })
            })
            const ids = data.map(item => item.id)
            setEventIds(ids)
            setIsLoading(false)
        }
    }, [data, error])

    const generateDisplayPrice = (ticket_types) => {
        const allAskPrices = ticket_types.flatMap(ticketType => ticketType.user_asks).map(ask => parseFloat(ask.price))
        if (allAskPrices.length > 0) {
            return "From £" + Math.min(...allAskPrices).toFixed(2)
        }
        else {
            return "From £"
        }
    }

    const carouselItem = ({item}) => {
        return (
        <Pressable
        style={({pressed}) => ({opacity: pressed ? 0.8 : 1})}
        onPress={() => onPress(item.id)}
        >
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
        </Pressable>
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
                    {events.map((item, index) => (
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
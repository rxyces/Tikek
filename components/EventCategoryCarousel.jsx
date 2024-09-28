import { View, Text, ScrollView } from 'react-native'
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query'

import EventCategoryItem from './EventCategoryItem';
import Error from './Error';
import { eventSelectors } from "../stores/authenticatedSelectors"
import { useEventStore, useTicketStore } from "../stores/authenticatedStore"
import { getEventDataByCategory } from '../utils/dataRetrieval';



const EventCategoryCarousel = ({ categoryTitle }) => {
    //states
    const [isLoading, setIsLoading] = useState(true)
    const [eventIds, setEventIds] = useState([])

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
                        <EventCategoryItem item={item}/>
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
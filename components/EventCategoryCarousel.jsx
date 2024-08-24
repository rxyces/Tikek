import { View, Text, ScrollView } from 'react-native'
import { Image } from 'expo-image';
import { supabase } from "../lib/supabase"
import { useEffect, useState } from 'react';
import { format } from "date-fns"

import Error from './Error';

const dummyData = {
    categoryTitle: "Popular",
    databaseTitle: "popular",
    items : [
        {title: "Old School Hip-Hop Outdoor Summer BBQ", price: "From £9.80", date: "Aug, 21st", location: "SWG3 Glasgow", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDI0LzgvMTUvMTMvMjkvNTkvNDA0L1JpZmYtUmFmZi1NTVUtMjAyNC1IZWF0aGVyLUJvd2xpbmcuanBlZyJdXQ?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
        {title: "Old School Hip-Hop Outdoor Summer BBQ", price: "From £9.80", date: "Aug, 21st", location: "SWG3 Glasgow", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDI0LzgvMTUvMTMvMjkvNTkvNDA0L1JpZmYtUmFmZi1NTVUtMjAyNC1IZWF0aGVyLUJvd2xpbmcuanBlZyJdXQ?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
        {title: "Old School Hip-Hop Outdoor Summer BBQ", price: "From £9.80", date: "Aug, 21st", location: "SWG3 Glasgow", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDI0LzgvMTUvMTMvMjkvNTkvNDA0L1JpZmYtUmFmZi1NTVUtMjAyNC1IZWF0aGVyLUJvd2xpbmcuanBlZyJdXQ?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
        {title: "Old School Hip-Hop Outdoor Summer BBQ", price: "From £9.80", date: "Aug, 21st", location: "SWG3 Glasgow", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDI0LzgvMTUvMTMvMjkvNTkvNDA0L1JpZmYtUmFmZi1NTVUtMjAyNC1IZWF0aGVyLUJvd2xpbmcuanBlZyJdXQ?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
        {title: "Old School Hip-Hop Outdoor Summer BBQ", price: "From £9.80", date: "Aug, 21st", location: "SWG3 Glasgow", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDI0LzgvMTUvMTMvMjkvNTkvNDA0L1JpZmYtUmFmZi1NTVUtMjAyNC1IZWF0aGVyLUJvd2xpbmcuanBlZyJdXQ?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
        {title: "Old School Hip-Hop Outdoor Summer BBQ", price: "From £9.80", date: "Aug, 21st", location: "SWG3 Glasgow", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDI0LzgvMTUvMTMvMjkvNTkvNDA0L1JpZmYtUmFmZi1NTVUtMjAyNC1IZWF0aGVyLUJvd2xpbmcuanBlZyJdXQ?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
    ],

}

const EventCategoryCarousel = ({ data }) => {
    //states
    const [isLoading, setIsLoading] = useState(true)
    const [errorText, setErrorText] = useState("")
    const [eventData, setEventData] = useState(null)

    //loading image
    const source = require("../assets/images/loading_placeholder.png")

    useEffect(() => {
        setErrorText("")
        const getRecords = async () => {
            const { data: popularEventData, error: popularEventsError } = await supabase
            .from(`${dummyData.databaseTitle}_events`)
            .select('id')
            
            if (popularEventsError) {
                console.error(JSON.stringify(popularEventsError))
                setErrorText("Failed fetching events, reload")
            } 
            else {
                const eventIDs = popularEventData.map(event => event.id)
                const { data: eventData, error: eventError } = await supabase
                .from('events')
                .select('*')
                .in('id', eventIDs)

                if (eventError) {
                    console.error(JSON.stringify(eventError))
                    setErrorText("Failed fetching events, reload")
                }
                else {
                    return eventData
                }
                }
        }
        getRecords().then((eventData) => {
            setEventData(eventData)
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
                £999
            </Text>
        </View>
        );
    }

    return (
        <View className="min-w-5/6">
            <Text className="font-wregular text-[20px] text-[#DFE3EC]">
                {dummyData.categoryTitle}
            </Text>

            {errorText ? 
            <Error errorText={errorText}/> : isLoading ? "" : (
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="mt-4 flex flex-row space-x-8">
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
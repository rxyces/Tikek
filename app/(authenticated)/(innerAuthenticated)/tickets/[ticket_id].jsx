import { View, Text, SafeAreaView, Pressable, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { useAuthenticatedContext } from '../../../../context/AuthenticatedContext';
import Error from '../../../../components/Error';
import InfoIcon from "../../../../assets/svgs/info_icon.svg"
import ListingsTable from '../../../../components/ListingsTable';

const ticketPage = () => {
    const { ticket_id, event_id} = useLocalSearchParams();

    //context
    const { allEventData } = useAuthenticatedContext()

    //states
    const [ ticketData, setTicketData ] = useState(null)
    const [ eventData, setEventData ] = useState(null)
    const [ errorText, setErrorText ] = useState("")
    const [ isLoading, setIsLoading ] = useState(true)


    useEffect(() => {
        setErrorText("")
        setIsLoading(true)
        //impossible for ticket and event data to not exist in context as to get teh ticket id to access the page you must request the event first
        if (!event_id) {
            let eventIndex = 0
            while (eventIndex < allEventData.length) {
                const foundMatchingTicket = allEventData[eventIndex].ticket_types.find(ticketType => ticketType.id == ticket_id)
                if (foundMatchingTicket) {
                    setTicketData(foundMatchingTicket)
                    setEventData(allEventData[eventIndex])

                    eventIndex = allEventData.length + 1
                }
                else {
                    eventIndex += 1
                }
            }
            if (eventIndex != allEventData.length + 1) {
                setErrorText("Error, failed finding ticket and event data")
            }
        }
        else {
            const currentEventData = allEventData.find(event => event.id == event_id)
            setEventData(currentEventData)
            setTicketData(currentEventData.ticket_types.find(ticketType => ticketType.id == ticket_id))
        }
        setIsLoading(false)
    }, [])

    const generateDisplayPrice = (listingData) => {
        const allPrices = listingData.flatMap(listing => parseFloat(listing.price))
        if (allPrices.length > 0) {
            return "£" + Math.min(...allPrices).toFixed(2)
        }
        else {
            return "---"
        }
    }
    
    if (errorText)  {
        return (
            <View className="flex-1 justify-center items-center">
                <Error errorText={errorText}/>
            </View>
        )
        }
    else if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
            </View>
        )
    }
    else {
        return (
            <SafeAreaView className="flex-1">
                <View className="flex-1 items-center mt-4">
                    <View className="flex-1 w-5/6">
                        <View className="space-y-1">
                            <Text className="font-wsemibold text-[#DFE3EC] text-[20px] text-center" numberOfLines={1} ellipsizeMode='tail'>
                                {ticketData.name + " ticket"}
                            </Text>
                            <Text className="font-wmedium text-[#C1C8D7] text-[18px] text-center" numberOfLines={2} ellipsizeMode='tail'>
                                {eventData.title}
                            </Text>
                        </View>

                        <Pressable
                        style={({ pressed }) => ({
                            opacity: pressed ? 0.8 : 1,
                            paddingVertical: 32,
                            marginVertical: -32,
                            marginTop: 4,
                        })}>
                            <View className="flex-row gap-2 items-center w-full">
                                <Text className="font-wmedium text-[18px] text-[#DFE3EC]">
                                    Tickets for sale
                                </Text>
                                <InfoIcon width={24} height={24} />
                            </View>
                        </Pressable>

                        <View className="mt-2">
                            <ListingsTable listingData={ticketData.user_asks} ascending={true}/>
                        </View>
                        
                        <Pressable
                        style={({ pressed }) => ({
                            opacity: pressed ? 0.8 : 1,
                            paddingVertical: 32,
                            marginVertical: -32,
                            marginTop: 4,
                        })}>
                            <View className="flex-row gap-2 items-center w-full">
                                <Text className="font-wmedium text-[18px] text-[#DFE3EC]">
                                    Buyers' offers
                                </Text>
                                <InfoIcon width={24} height={24} />
                            </View>
                        </Pressable>

                        <View className="mt-2">
                            <ListingsTable listingData={ticketData.user_offers} ascending={false}/>
                        </View>

                        <View className="flex-1 justify-between mb-20 items-end flex-row">
                            <Pressable
                            style={({ pressed }) => [
                                { opacity: pressed ? 0.8 : 1 },
                            ]}
                            onPress={() => {}}>
                                <View className={`justify-center items-center min-w-[45%] min-h-[55px] max-h-[55px] rounded-2xl`} style={[styles.sellShadow, { backgroundColor: "#ADB3C1" }]}>
                                    <View className="flex-row items-center gap-2">
                                        <View>
                                            <Text className="font-wsemibold text-[16px] text-white">
                                                Sell
                                            </Text>
                                            <Text className="font-wregular text-[12px] text-white">
                                                Or ask
                                            </Text>
                                        </View>
                                        <Text className="font-wsemibold text-[24px] text-white">
                                            {generateDisplayPrice(ticketData.user_offers)}
                                        </Text>
                                    </View>
                                    
                                </View>
                            </Pressable>

                            <Pressable
                            style={({ pressed }) => [
                                { opacity: pressed ? 0.8 : 1 },
                            ]}
                            onPress={() => {}}>
                                <View className={`justify-center items-center min-w-[45%] min-h-[55px] max-h-[55px] rounded-2xl`} style={[styles.buyShadow, { backgroundColor: "#791DF3" }]}>
                                    <View className="flex-row items-center gap-2">
                                        <View>
                                            <Text className="font-wsemibold text-[16px] text-white">
                                                Buy
                                            </Text>
                                            <Text className="font-wregular text-[12px] text-white">
                                                Or offer
                                            </Text>
                                        </View>
                                        <Text className="font-wsemibold text-[24px] text-white">
                                        {generateDisplayPrice(ticketData.user_asks)}
                                        </Text>
                                    </View>
                                    
                                </View>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </SafeAreaView>
        )   
    }
    
}

export default ticketPage

const styles = StyleSheet.create({
    sellShadow: {
        shadowColor: "#DFE3EC",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 6,
        },
    buyShadow: {
        shadowColor: "#8983F3",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 6,
        },
});
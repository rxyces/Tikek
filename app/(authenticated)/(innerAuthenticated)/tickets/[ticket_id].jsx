import { View, Text, SafeAreaView, Pressable, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query'

import { ticketSelectors, eventSelectors } from "../../../../stores/authenticatedSelectors"
import { useEventStore, useTicketStore } from "../../../../stores/authenticatedStore"
import { getTicketByID, getRecordsByID } from '../../../../utils/dataRetrieval';
import Error from '../../../../components/Error';
import InfoIcon from "../../../../assets/svgs/info_icon.svg"
import ListingsTable from '../../../../components/ListingsTable';

const ticketPage = () => {
    const { ticket_id } = useLocalSearchParams();

    //states
    const [existsInStore, setExistsInStore] = useState(true)

    const { data: ticketData, isLoading: ticketLoading, error: ticketError } = useQuery({
        queryKey: ["ticketID", ticket_id],
        queryFn: () => getTicketByID(ticket_id),
        staleTime: 3 * 60 * 1000,
        refetchInterval: 300000,
        enabled: !existsInStore, //as this is true its disabled off load so will only make the req if state is updated
    });

    const retrievedEventId = ticketData? ticketData[0].event_id : undefined

    const { data: eventData, isLoading: eventLoading, error: eventError } = useQuery({
        queryKey: ["eventID", retrievedEventId],
        queryFn: () => getRecordsByID(retrievedEventId),
        staleTime: 3 * 60 * 1000,
        refetchInterval: 300000,
        enabled: !!retrievedEventId, //only runs if ticketdata had to be fetched meaning the whole event needs to be fetched as well
    });

    const ticket = useTicketStore((state) => ticketSelectors.getTicketById(ticket_id)(state))
    const event = useEventStore((state) => eventSelectors.getEventById(ticket.event_id)(state))
    const addEvent = useEventStore((state) => state.addEvent)
    const addTicket = useTicketStore((state) => state.addTicket)
    const ticketHighestOffer = useTicketStore((state) => ticketSelectors.getTicketHighestOffer(ticket_id)(state))
    const ticketLowestAsk = useTicketStore((state) => ticketSelectors.getTicketLowestAsk(ticket_id)(state))
    
    useEffect(() => {
        //if it dosent exist in the store get the whole event since ill need the event data later anyway so get whole evnt data including the specific ticket stuff
        if (!ticket) {
            setExistsInStore(false)
            if (ticketData && eventData) {
                addEvent(eventData[0])
                addTicket(ticketData[0])
                setExistsInStore(true)
            }
        }
    }, [ticketData, eventData, eventError, ticketError])

    const generateDisplayPrice = (listingData) => {
        const allPrices = listingData.flatMap(listing => parseFloat(listing.price))
        if (allPrices.length > 0) {
            return "£" + Math.min(...allPrices).toFixed(2)
        }
        else {
            return "---"
        }
    }
    
    if (ticketError || eventError)  {
        return (
            <View className="flex-1 justify-center items-center">
                <Error errorText={ticketError + eventError}/>
            </View>
        )
        }
    else if (eventLoading || ticketLoading || !ticket || !event) {
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
                                {ticket.name + " ticket"}
                            </Text>
                            <Text className="font-wmedium text-[#C1C8D7] text-[18px] text-center" numberOfLines={2} ellipsizeMode='tail'>
                                {event.title}
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
                            <ListingsTable listingData={ticket.user_asks} ascending={true}/>
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
                            <ListingsTable listingData={ticket.user_offers} ascending={false}/>
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
                                            {ticketHighestOffer == "---" ? ticketHighestOffer : "£" + ticketHighestOffer}
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
                                        {ticketLowestAsk == "---" ? ticketLowestAsk : "£" + ticketLowestAsk}
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
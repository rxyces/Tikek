import { View, Text, SafeAreaView, Pressable, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { A } from '@expo/html-elements';
import { format } from "date-fns"
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import Animated, { 
    LinearTransition,
    withTiming,
    useSharedValue,
    useAnimatedStyle,
    Easing,
} from 'react-native-reanimated';

import { ticketSelectors, eventSelectors } from "../../../../stores/authenticatedSelectors"
import { useEventStore, useTicketStore } from "../../../../stores/authenticatedStore"
import { getTicketByID, getRecordsByID } from '../../../../utils/dataRetrieval';
import Error from '../../../../components/Error';
import DateIcon from "../../../../assets/svgs/date_icon.svg"
import UrlIcon from "../../../../assets/svgs/url_icon.svg"
import TicketTypeIcon from "../../../../assets/svgs/ticket_type_icon.svg"
import DownSelector from  "../../../../assets/svgs/down_selector.svg"
import AddPriceIcon from "../../../../assets/svgs/add_price_icon.svg"
import MinusIcon from "../../../../assets/svgs/minus_icon.svg"

const buyTicketPage = () => {
    const { ticket_id } = useLocalSearchParams();

    //animation shared values
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(0)
    const maxHeight = useSharedValue(80)

    //states
    const [expandedDetails, setExpandedDetails] = useState(false)
    const [displayPrice, setDisplayPrice] = useState(null)
    const [displayText, setDisplayText] = useState("Buy a ticket now at this price")
    
    //states
    const [existsInStore, setExistsInStore] = useState(true)

    //expand details
    const handleMoreInfoPress = () => {
        setExpandedDetails(!expandedDetails) // change state
        rotation.value = withTiming(rotation.value + 180, { duration: 300 }) // rotate more arrow
        opacity.value = withTiming(expandedDetails ? 0 : 1, { duration: 300, easing: Easing.linear }) // change from having darkened gradient over text to hide it, to no gradient
        maxHeight.value = withTiming(expandedDetails ? 80 : 1000, { duration: 300, easing: Easing.linear }) // height of how much text is shown

    }

    //animated style for the rotate arrow
    const selectorAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }]
        };
    });

    //animated style for the actual text
    const detailsAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            maxHeight: maxHeight.value
        }
    });

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
    const ticketLowestAsk = useTicketStore((state) => ticketSelectors.getTicketLowestAsk(ticket_id)(state))
    
    useEffect(() => {
        //set the initial display price and never update from store again since user should now be changing the prices
        setDisplayPrice(ticketLowestAsk)
    }, [])

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

    const onMinusPress = () => {
        if (displayPrice <= 0.50) {
            return
        }

        let newPrice = displayPrice - 0.50
        if (newPrice == ticketLowestAsk) {
            setDisplayText("Buy a ticket now at this price")
        }
        else {
            const offersAhead = ticket.user_offers.filter(offer => {
                return parseFloat(offer.price) >= newPrice
            })
            setDisplayText(offersAhead.length == 1 ? offersAhead.length + " offer ahead at this price" : offersAhead.length + " offers ahead at this price")
        }

        setDisplayPrice(prevPrice => parseFloat(prevPrice) - 0.50)
    }

    const onAddPress = () => {
        if (displayPrice == ticketLowestAsk) {
            return
        }

        let newPrice = displayPrice + 0.50
        if (newPrice == ticketLowestAsk) {
            setDisplayText("Buy a ticket now at this price")
        }
        else {
            const offersAhead = ticket.user_offers.filter(offer => {
                return parseFloat(offer.price) >= newPrice
            })
            setDisplayText(offersAhead.length == 1 ? offersAhead.length + " offer ahead at this price" : offersAhead.length + " offers ahead at this price")
        }

        setDisplayPrice(prevPrice => parseFloat(prevPrice) + 0.50)
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
            <SafeAreaView >
                <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <View className="flex-1 items-center mt-4">
                        <View className="w-5/6">

                            <View>
                                <Text className="font-wsemibold text-[#DFE3EC] text-[20px] mt-4" numberOfLines={2} ellipsizeMode='tail'>
                                    {event.title}
                                </Text>
                                <View className="space-y-0 mt-4">
                                    <View className="flex-row gap-2 items-center">
                                        <DateIcon width={24} height={24} />
                                        <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                            {event?.date ? format(new Date(event.date), 'MMM, do') : "---"}
                                        </Text>
                                    </View>

                                    <View className="flex-row gap-2 items-center">
                                        <UrlIcon width={24} height={24} />
                                        <Text className="font-wmedium text-[18px] text-[#C1C8D7] underline">
                                            <A href={event?.original_url || "---"}>Event URL</A>
                                        </Text>
                                    </View>

                                    <View className="flex-row gap-2 items-center">
                                        <TicketTypeIcon width={24} height={24} />
                                        <Text className="font-wsemibold text-[18px] text-[#DFE3EC]">
                                            {ticket?.name || "---"} 
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Pressable
                                style={({ pressed }) => ({
                                    opacity: pressed ? 0.8 : 1,
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between',
                                    marginTop: 24,
                                    paddingVertical: 32,
                                    marginVertical: -32,
                                })}
                            onPress={handleMoreInfoPress}
                            >
                                <Text className="font-wregular text-[18px] text-[#DFE3EC] underline">
                                    Ticket specifics
                                </Text>
                                <View className="flex-row gap-2 items-center">
                                    <Text className="font-wregular text-[16px] text-[#ADB3C1]">
                                        More
                                    </Text>

                                    <Animated.View style={selectorAnimatedStyle}>
                                        <DownSelector width={20} height={20} />
                                    </Animated.View>
                                    
                                </View>
                            </Pressable>
                            

                            <View className="mt-4">
                                <MaskedView 
                                maskElement={
                                <Text className="font-wregular text-[16px] bg-transparent" numberOfLines={100} ellipsizeMode='tail'>
                                    {ticket?.details || "---"}
                                </Text>
                                }>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={['#C1C8D7', 'transparent']}
                                    >
                                        <Animated.View className="opacity-0" style={detailsAnimatedStyle}>
                                            <Text className="font-wregular text-[16px] text-[#C1C8D7]" numberOfLines={100} ellipsizeMode='tail'>
                                                {ticket?.details || "---"}
                                            </Text>
                                        </Animated.View>
                                    </LinearGradient>
                                </MaskedView>
                            </View>
                            
                            <View className="self-center space-y-2 items-center justify-center">
                                <View className="mt-8 rounded-xl bg-[#24242D] min-h-[60px] max-w-[75%]">
                                    <View className="mx-4 flex-row items-center justify-between">
                                        <Pressable
                                            style={({ pressed }) => ({
                                                opacity: pressed ? 0.6 : 1,
                                                paddingVertical: 32,
                                                marginVertical: -32,
                                                paddingHorizontal: 20,
                                                marginHorizontal: -20,
                                                justifyContent: "center",
                                                alignContent: "center"
                                            })}
                                        onPress={onMinusPress}
                                        >
                                            <MinusIcon width={24} height={24} />
                                        </Pressable>

                                        <View className="min-w-[150px] w-[150px] items-center justify-center">
                                            <Text className="font-wsemibold text-[48px] text-[#FFFFFF]" numberOfLines={1} ellipsizeMode='tail'>
                                                {displayPrice ? "£" + parseFloat(displayPrice).toFixed(2) : "---"}
                                            </Text>
                                        </View>
                                        
                                        <Pressable
                                            style={({ pressed }) => ({
                                                opacity: pressed ? 0.6 : 1,
                                                paddingVertical: 32,
                                                marginVertical: -32,
                                                paddingHorizontal: 20,
                                                marginHorizontal: -20,
                                                justifyContent: "center",
                                                alignContent: "center"
                                            })}
                                        onPress={onAddPress}
                                        >
                                            <AddPriceIcon width={24} height={24} />
                                        </Pressable>
                                        
                                    </View>
                                </View>
                                <Text className="font-wregular text-[14px] text-[#C1BBF6]">
                                    {displayText}
                                </Text>
                            </View>
                            

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default buyTicketPage
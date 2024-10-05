import { View, Text, ScrollView, SafeAreaView, Pressable, ActivityIndicator, RefreshControl } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { Image } from 'expo-image';
import Animated, { 
    LinearTransition,
    withTiming,
    useSharedValue,
    useAnimatedStyle,
    Easing,
} from 'react-native-reanimated';
import { format } from "date-fns"
import { A } from '@expo/html-elements';
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import { useQuery } from '@tanstack/react-query'

import { useEventStore, useTicketStore } from '../../../../stores/authenticatedStore';
import { eventSelectors } from '../../../../stores/authenticatedSelectors';
import Error from '../../../../components/Error';
import TicketWidget from '../../../../components/TicketWidget';
import AddTicketTypeWidget from '../../../../components/AddTicketType';
import { getRecordsByID } from '../../../../utils/dataRetrieval';
import DateIcon from "../../../../assets/svgs/date_icon.svg"
import LocationIcon from "../../../../assets/svgs/location_icon.svg"
import OrganiserIcon from "../../../../assets/svgs/organiser_icon.svg"
import UrlIcon from "../../../../assets/svgs/url_icon.svg"
import DownSelector from "../../../../assets/svgs/down_selector.svg"

const eventPage = () => {
    //local value from route
    const { event_id } = useLocalSearchParams();

    //animation shared values
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(0)
    const maxHeight = useSharedValue(80)

    //states
    const [expandedDetails, setExpandedDetails] = useState(false)
    const [existsInStore, setExistsInStore] = useState(true) //true by default so it dosent send req on load before the states have had time to check
    const [refreshing, setRefreshing] = useState(false);

    //loading image
    const source = require("../../../../assets/images/loading_placeholder.png")

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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch()
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["eventID", event_id],
        queryFn: () => getRecordsByID(event_id),
        staleTime: 3 * 60 * 1000,
        refetchInterval: 300000,
        enabled: !existsInStore, //as this is true its disabled off load so will only make the req if state is updated
    });

    const event = useEventStore((state) => eventSelectors.getEventById(event_id)(state))
    const addEvent = useEventStore((state) => state.addEvent)
    const addTicket = useTicketStore((state) => state.addTicket)

    useEffect(() => {
        //event dosent exist in store so load it up
        if (!event) {
            setExistsInStore(false)
            if (data) {
                addEvent(data[0])
                data[0].ticket_types.forEach(newTicket => {
                    addTicket(newTicket)
                })
                setExistsInStore(true)
            }
        }
        //if refreshing and the new refetched data has loaded in then reset the stores to prevent a blank loading state transition
        if (refreshing && data) {
            addEvent(data[0])
            data[0].ticket_types.forEach(newTicket => {
                addTicket(newTicket)
            })
            setExistsInStore(true)
        } 
    }, [data, error])

    if (error)  {
        return (
            <View className="flex-1 justify-center items-center">
                <Error errorText={error}/>
            </View>
        )
        }
    else if (isLoading || !event) {
        return (
            <SafeAreaView>
                <ScrollView>
                    <View className="flex-1 items-center mt-4">
                        <View className="w-5/6">
                            <View className="h-[170px] border-2 border-[#C6D8FF] rounded-xl">
                                <Image
                                className="flex-1 rounded-xl"
                                source={source}
                                contentFit="cover"
                                placeholder={source}
                                />
                            </View>

                            <Text className="font-wsemibold text-[#DFE3EC] text-[20px] mt-4" numberOfLines={2} ellipsizeMode='tail'>
                                Damm I need to work on my internet, nothings loading
                            </Text>

                            <View className="space-y-0 mt-4">
                                <View className="flex-row gap-2 items-center">
                                    <DateIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        Friday, Oct 13th
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <LocationIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        Mars 
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <OrganiserIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        Mars O2
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <UrlIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7] underline">
                                        No Event URL :(
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-start justify-between mt-8">
                                <Text className="font-wregular text-[18px] text-[#DFE3EC] underline">
                                    Event details
                                </Text>
                                <View className="flex-row gap-2 items-center">
                                    <Text className="font-wregular text-[16px] text-[#ADB3C1]">
                                        More
                                    </Text>
                                    <DownSelector width={20} height={20} />
                                </View>
                            </View>

                            <View className="mt-4">
                                <MaskedView 
                                maskElement={
                                <Text className="font-wregular text-[16px] bg-transparent" numberOfLines={100} ellipsizeMode='tail'>
                                    Get ready for an otherworldly Halloween experience at the first-ever Mars-querade Ball! Don your most creative costume and float through the low-gravity dance floor under the eerie glow of Phobos and Deimos. Enjoy Martian delicacies, eerie space-themed music, and a costume contest that's out of this world!
                                </Text>
                                }>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={['#C1C8D7', 'transparent']}
                                    >
                                        <Animated.View className="opacity-0" style={detailsAnimatedStyle}>
                                            <Text className="font-wregular text-[16px] text-[#C1C8D7]" numberOfLines={100} ellipsizeMode='tail'>
                                            Get ready for an otherworldly Halloween experience at the first-ever Mars-querade Ball! Don your most creative costume and float through the low-gravity dance floor under the eerie glow of Phobos and Deimos. Enjoy Martian delicacies, eerie space-themed music, and a costume contest that's out of this world!
                                            </Text>
                                        </Animated.View>
                                    </LinearGradient>
                                </MaskedView>
                            </View>
                            
                            <Text className="font-wregular text-[12px] text-[#60697B] underline">
                                How it works?
                            </Text>

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    } 
    else {
        return (
            <SafeAreaView>
                <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
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
                        <View className="w-5/6">
                            <View className="h-[170px] border-2 border-[#C6D8FF] rounded-xl">
                                <Image
                                className="flex-1 rounded-xl"
                                source={event ? event.image : source}
                                contentFit="cover"
                                placeholder={source}
                                />
                            </View>

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
                                    <LocationIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        {event?.location || "---"} 
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <OrganiserIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        {event?.organiser || "---"} 
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <UrlIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7] underline">
                                        <A href={event?.original_url || "---"}>Event URL</A>
                                    </Text>
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
                                    Event details
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
                                    {event?.details || "---"}
                                </Text>
                                }>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={['#C1C8D7', 'transparent']}
                                    >
                                        <Animated.View className="opacity-0" style={detailsAnimatedStyle}>
                                            <Text className="font-wregular text-[16px] text-[#C1C8D7]" numberOfLines={100} ellipsizeMode='tail'>
                                                {event?.details || "---"}
                                            </Text>
                                        </Animated.View>
                                    </LinearGradient>
                                </MaskedView>
                            </View>

                            <Animated.View layout={LinearTransition}>
                                <Pressable
                                    style={({ pressed }) => ({
                                        opacity: pressed ? 0.8 : 1,
                                        width: "100%",
                                        marginTop: 16
                                    })}
                                    onPress={() => {router.push({pathname:`/tickets/1?event_id=1`})}}>
                                        <Text className="font-wregular text-[12px] text-[#60697B] underline">
                                            How it works?
                                        </Text>
                                </Pressable>
                            </Animated.View>

                            <Animated.View layout={LinearTransition} className="mt-4">
                                {event.ticket_types
                                .sort((a, b) => b.user_asks.length - a.user_asks.length) //sort descending order
                                .map(ticketType => ( 
                                    // for spacing between elements
                                    <View key={ticketType.id} className="mb-4"> 
                                        <TicketWidget ticketTypeData={ticketType}/> 
                                    </View>
                                ))}
                                <AddTicketTypeWidget eventData={{id: "123"}}/>
                                
                            </Animated.View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default eventPage
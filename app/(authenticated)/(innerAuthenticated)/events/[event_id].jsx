import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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

import Error from '../../../../components/Error';
import TicketWidget from '../../../../components/TicketWidget';
import { getRecordsByID } from '../../../../utils/dataRetrieval';
import { useAuthenticatedContext } from '../../../../context/AuthenticatedContext';
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
    const [existsInContext, setExistsInContext] = useState(true) //true by default so it dosent send req on load before the states have had time to check
    const [eventData, setEventData] = useState(null)

    //context
    const { allEventData, setAllEventData } = useAuthenticatedContext()

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

    const { data, isLoading, error } = useQuery({
        queryKey: ["eventID", event_id],
        queryFn: () => getRecordsByID(event_id),
        staleTime: 3 * 60 * 1000,
        refetchInterval: 300000,
        enabled: !existsInContext, //as this is true its disabled off load so will only make the req if state is updated
    });

    useEffect(() => {
        const currentEventData = allEventData.find(event => event.id == event_id) //check if event already exists in the context
        if (currentEventData) {
            //if it does exist in the context then no need to fetch it again
            setEventData(currentEventData)
            setExistsInContext(true)
        }
        else {
            setExistsInContext(false)
            //on first load where its not in context the state is updated and there wont be data yet because the req hasnt picked up the new state yet so it will end there and re run once req has been made and correctly add to context
            if (data) {
                setEventData(data[0])
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
                setExistsInContext(true)
            }
        }
    }, [data, error])

    if (error)  {
        return (
            <View className="flex-1 justify-center items-center">
                <Error errorText={error}/>
            </View>
        )
        }
    else if (isLoading || !eventData) {
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
                <ScrollView>
                    <View className="flex-1 items-center mt-4">
                        <View className="w-5/6">
                            <View className="h-[170px] border-2 border-[#C6D8FF] rounded-xl">
                                <Image
                                className="flex-1 rounded-xl"
                                source={eventData ? eventData.image : source}
                                contentFit="cover"
                                placeholder={source}
                                />
                            </View>

                            <Text className="font-wsemibold text-[#DFE3EC] text-[20px] mt-4" numberOfLines={2} ellipsizeMode='tail'>
                                {eventData.title}
                            </Text>

                            <View className="space-y-0 mt-4">
                                <View className="flex-row gap-2 items-center">
                                    <DateIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        {eventData?.location ? format(new Date(eventData.date), 'MMM, do') : "---"}
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <LocationIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        {eventData?.location || "---"} 
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <OrganiserIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        {eventData?.organiser || "---"} 
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <UrlIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7] underline">
                                        <A href={eventData?.original_url || "---"}>Event URL</A>
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
                                    {eventData?.details || "---"}
                                </Text>
                                }>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={['#C1C8D7', 'transparent']}
                                    >
                                        <Animated.View className="opacity-0" style={detailsAnimatedStyle}>
                                            <Text className="font-wregular text-[16px] text-[#C1C8D7]" numberOfLines={100} ellipsizeMode='tail'>
                                                {eventData?.details || "---"}
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
                                    onPress={() => {}}>
                                        <Text className="font-wregular text-[12px] text-[#60697B] underline">
                                            How it works?
                                        </Text>
                                </Pressable>
                            </Animated.View>

                            <Animated.View layout={LinearTransition} className="mt-4">
                                {eventData.ticket_types.map(ticketType => ( 
                                    // for spacing between elements
                                    <View key={ticketType.id} className="mb-4"> 
                                        <TicketWidget ticketTypeData={ticketType} eventId={eventData.id}/> 
                                    </View>
                                ))}
                                
                            </Animated.View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default eventPage
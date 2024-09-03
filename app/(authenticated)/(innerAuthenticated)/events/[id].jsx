import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Pressable } from 'react-native'
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

import Error from '../../../../components/Error';
import TicketWidget from '../../../../components/TicketWidget';
import { getRecordsByID, getTicketTypeByEventID } from '../../../../utils/dataRetrieval';
import { useAuthenticatedContext } from '../../../../context/AuthenticatedContext';
import DateIcon from "../../../../assets/svgs/date_icon.svg"
import LocationIcon from "../../../../assets/svgs/location_icon.svg"
import OrganiserIcon from "../../../../assets/svgs/organiser_icon.svg"
import UrlIcon from "../../../../assets/svgs/url_icon.svg"
import DownSelector from "../../../../assets/svgs/down_selector.svg"

const eventPage = () => {
    //local value from route
    const { id } = useLocalSearchParams();

    //animation shared values
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(0)
    const maxHeight = useSharedValue(80)

    //states
    const [currentEventDetails, setCurrentEventDetails] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [errorText, setErrorText] = useState("")
    const [expandedDetails, setExpandedDetails] = useState(false)
    const [ticketTypes, setTicketTypes] = useState([])

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

    //loading data for the event
    useEffect(() => {
        setErrorText("")
        getTicketTypeByEventID(id).then(({data, error}) => { 
            if (!error) {
                setTicketTypes(data)
            }
            else {
                setErrorText(error)
            }
        }
        )

        const eventExists = allEventData.some(event => event.id == id) //check if event already exists in the context
        if (eventExists) {
            const eventDetails = allEventData.find(event => event.id == id) //if it does exist in the context then no need to fetch it again
            setCurrentEventDetails(eventDetails)
            setIsLoading(false)
        }
        else {
            getRecordsByID({id}).then(({data, error}) => { //id dosent exist in the cotext so have to fetch it again
                if (!error) {
                    setCurrentEventDetails(data[0])
                    setAllEventData(prevData => {
                        const uniqueNewData = data.filter(item => !prevData.some(existingItem => existingItem.id == item.id))
                        return [...prevData, ...uniqueNewData] //store the newly fetched id that was previously missing
                    });
                }
                else {
                    setErrorText(error)
                }
                setIsLoading(false)
            }
            )
        }
    }, [])

    if (errorText)  {
        return (
            <View className="flex-1 justify-center items-center">
                <Error errorText={errorText}/>
            </View>
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
                                source={currentEventDetails ? currentEventDetails.image : source}
                                contentFit="cover"
                                placeholder={source}
                                />
                            </View>

                            <Text className="font-wsemibold text-[#DFE3EC] text-[20px] mt-4" numberOfLines={2} ellipsizeMode='tail'>
                                {currentEventDetails.title}
                            </Text>

                            <View className="space-y-0 mt-4">
                                <View className="flex-row gap-2 items-center">
                                    <DateIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        {currentEventDetails?.location ? format(new Date(currentEventDetails.date), 'MMM, do') : "---"}
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <LocationIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        {currentEventDetails?.location || "---"} 
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <OrganiserIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                                        {currentEventDetails?.organiser || "---"} 
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center">
                                    <UrlIcon width={24} height={24} />
                                    <Text className="font-wmedium text-[18px] text-[#C1C8D7] underline">
                                        <A href={currentEventDetails?.original_url || "---"}>Event URL</A>
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
                                    {currentEventDetails?.details || "---"}
                                </Text>
                                }>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={['#C1C8D7', 'transparent']}
                                    >
                                        <Animated.View className="opacity-0" style={detailsAnimatedStyle}>
                                            <Text className="font-wregular text-[16px] text-[#C1C8D7]" numberOfLines={100} ellipsizeMode='tail'>
                                                {currentEventDetails?.details || "---"}
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
                                {ticketTypes.map(ticketType => ( 
                                    // for spacing between elements
                                    <View key={ticketType.id} className="mb-4"> 
                                        <TicketWidget ticketTypeData={ticketType} /> 
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
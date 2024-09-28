import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { format } from "date-fns"
import { router } from 'expo-router'


import DateIcon from "../assets/svgs/date_icon.svg"
import PriceIcon from "../assets/svgs/price_icon.svg"
import LocationIcon from "../assets/svgs/location_icon.svg"
import RightSelector from "../assets/svgs/right_selector.svg"
import { eventSelectors } from "../stores/authenticatedSelectors"
import { useEventStore } from "../stores/authenticatedStore"

const onPress = (itemId) => {
    router.push({pathname:`/events/${itemId}`})
}

const FeaturedCarouselItem = ({ item }) => {
    //loading image
    const source = require("../assets/images/loading_placeholder.png")

    const lowestBuyPrice = useEventStore((state) => eventSelectors.getLowestBuyPrice(item.id)(state))
    return (
        <Pressable
            style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                flex: 1,
                alignItems: 'center'
            })}
            onPress={() => onPress(item.id)}
            >
            <View className="w-11/12 flex-1">
                <View className="h-[170px]">
                    <Image
                    className="flex-1 rounded-xl"
                    source={item.image}
                    contentFit="cover"
                    placeholder={source}
                    />
                </View>
                <Text className="font-wsemibold text-[20px] text-[#DFE3EC] my-2" numberOfLines={1} ellipsizeMode='tail'>
                    {item.title}
                </Text>
                <View className="">
                    <View className="flex-row gap-2 items-center">
                        <DateIcon width={24} height={24} />
                        <Text className="font-wregular text-[16px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                            {format(new Date(item.date), 'MMM, do')}
                        </Text>
                    </View>
                    <View className="flex-row items-center py-1 justify-between">
                        <View className="items-center flex-row gap-2">
                            <PriceIcon width={24} height={24} />
                            <Text className="font-wregular text-[16px] text-[#C1BBF6]" numberOfLines={1} ellipsizeMode='tail'>
                                {lowestBuyPrice ? "From £" + lowestBuyPrice : "From £"}
                            </Text>
                        </View>
                        <RightSelector width={24} height={24} />
                        
                    </View>
                    <View className="flex-row gap-2 items-center">
                        <LocationIcon width={24} height={24} />
                        <Text className="font-wmedium text-[16px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                            {item.location}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

export default FeaturedCarouselItem
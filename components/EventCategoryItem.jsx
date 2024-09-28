import { View, Text, Pressable } from 'react-native'
import { router } from 'expo-router';
import { format } from "date-fns"
import { Image } from 'expo-image';

import { eventSelectors } from "../stores/authenticatedSelectors"
import { useEventStore } from "../stores/authenticatedStore"

const onPress = (itemId) => {
    router.push({pathname:`/events/${itemId}`})
}

const EventCategoryItem = ({item}) => {
    //loading image
    const source = require("../assets/images/loading_placeholder.png")

    const lowestBuyPrice = useEventStore((state) => eventSelectors.getLowestBuyPrice(item.id)(state))

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
                    {lowestBuyPrice ? "From £" + lowestBuyPrice : "From £"}
                </Text>
            </View>
        </Pressable>
    );
}

export default EventCategoryItem
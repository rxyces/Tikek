import { View, Text, Pressable } from 'react-native'
import { router } from 'expo-router'

import StockIcon from "../assets/svgs/stock_icon.svg"

const TicketWidget = ({ticketTypeData, eventId}) => {
    return (
        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {router.push({pathname:`/tickets/${ticketTypeData.id}?event_id=${eventId}`})}}>
            <View className="w-full h-[120px] rounded-lg border-2 border-[#C6D8FF] self-center">
                <View className="mt-2 mb-4 mx-4 space-y-2">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-wsemibold text-[16px] text-[#DFE3EC]">
                            {ticketTypeData.name + " ticket"}
                        </Text>
                        <View className="flex-row gap-2 items-center mr-2">
                            <StockIcon width={24} height={24} />
                            <Text className="font-wsemibold text-[16px] text-[#C1C8D7]">
                                {ticketTypeData.user_asks.length}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <View className="min-w-[110px] min-h-[50px] bg-[#24242D] items-center justify-center rounded-lg">
                            <Text className="font-wregular text-[16px] text-[#C1BBF6]">
                                Lowest ask
                            </Text>
                            <Text className="font-wsemibold text-[24px] text-white">
                                {ticketTypeData.user_asks.length == 0 ? "---" : "£" + Math.min(...ticketTypeData.user_asks.map(ask => parseFloat(ask.price))).toFixed(2)}
                            </Text>
                        </View>

                        <View className="min-w-[110px] min-h-[50px] bg-[#24242D] items-center justify-center rounded-lg">
                            <Text className="font-wregular text-[16px] text-[#C1BBF6]">
                                Highest offer
                            </Text>
                            <Text className="font-wsemibold text-[24px] text-white">
                            {ticketTypeData.user_asks.length == 0 ? "---" : "£" + Math.max(...ticketTypeData.user_offers.map(ask => parseFloat(ask.price))).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}


export default TicketWidget
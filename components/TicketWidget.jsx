import { View, Text, Pressable } from 'react-native'
import { router } from 'expo-router'

import StockIcon from "../assets/svgs/stock_icon.svg"
import { useTicketStore } from '../stores/authenticatedStore'
import { ticketSelectors } from '../stores/authenticatedSelectors'

const TicketWidget = ({ticketTypeData}) => {
    const ticketHighestOffer = useTicketStore((state) => ticketSelectors.getTicketHighestOffer(ticketTypeData.id)(state))
    const ticketLowestAsk = useTicketStore((state) => ticketSelectors.getTicketLowestAsk(ticketTypeData.id)(state))

    return (
        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {router.push({pathname:`/tickets/${ticketTypeData.id}`})}}>
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
                                {ticketLowestAsk == "---" ? ticketLowestAsk : "£" + ticketLowestAsk}
                            </Text>
                        </View>

                        <View className="min-w-[110px] min-h-[50px] bg-[#24242D] items-center justify-center rounded-lg">
                            <Text className="font-wregular text-[16px] text-[#C1BBF6]">
                                Highest offer
                            </Text>
                            <Text className="font-wsemibold text-[24px] text-white">
                                {ticketHighestOffer == "---" ? ticketHighestOffer : "£" + ticketHighestOffer}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}


export default TicketWidget
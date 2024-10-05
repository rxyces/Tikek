import { View, Text, Pressable } from 'react-native'
import { router } from 'expo-router'

import AddIcon from "../assets/svgs/add_icon.svg"

const AddTicketTypeWidget = ({eventData}) => {

    return (
        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {router.push({pathname:`/tickets/${eventData.id}`})}}>
            <View className="w-full h-[120px] rounded-lg border-2 border-[#C6D8FF] border-dashed self-center">
                <View className="mt-2 mx-4 items-center flex-1">
                    <Text className="font-wsemibold text-[20px] text-[#DFE3EC]">
                        Add new ticket type
                    </Text>
                    <View className="mt-2 w-[55px] min-h-[40px] bg-[#24242D] items-center justify-center rounded-lg">
                        <AddIcon width={24} height={24} />
                    </View>
                    <View className="flex-1 items-center justify-end mb-2">
                        <Text className="font-wregular text-[12px] text-[#C1C8D7]">
                            Don't see the ticket type your trying to sell?
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}


export default AddTicketTypeWidget
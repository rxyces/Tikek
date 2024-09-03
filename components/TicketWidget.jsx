import { View, Text } from 'react-native'
import { useState, useEffect } from 'react'

import { useAuthenticatedContext } from '../context/AuthenticatedContext'
import { getTicketAsksByEventID } from '../utils/dataRetrieval'
import Error from './Error'
import StockIcon from "../assets/svgs/stock_icon.svg"

const TicketWidget = ({ticketTypeData}) => {
    //contexts
    const { allTicketData, setAllTicketData } = useAuthenticatedContext()

    //states
    const [ticketData, setTicketData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [errorText, setErrorText] = useState("")


    useEffect(() => {
        setErrorText("")
        const localData = allTicketData.find(item => item.id == ticketTypeData.id)
        if (localData) {
            console.log(localData)
            setTicketData(localData)
            setIsLoading(false)
        }
        else {
            getTicketAsksByEventID(ticketTypeData.id).then(({data, error}) => {
                if (!error) {
                    data = data[0]
                    setTicketData(data)
                    setAllTicketData(prevData => [...prevData, data])
                }
                else {
                    setErrorText(error)
                }
                
                setIsLoading(false)
            }
            )
        }
    }, [])

    if (errorText) {
        return (
            <View className="w-full h-[120px] rounded-lg border-2 border-[#C6D8FF] justify-center items-center">
                <Error errorText={errorText}/>
            </View>
        )
    }
    else if (isLoading) {
        return (
            <View className="w-full h-[120px] rounded-lg border-2 border-[#C6D8FF] justify-center items-center">
                <Text className="font-wmedium text-[16px] text-[#C1C8D7]">
                    Load already pls
                </Text>
            </View>
        )
    }
    else {
        return (
            <View className="w-full h-[120px] rounded-lg border-2 border-[#C6D8FF] self-center">
                <View className="mt-2 mb-4 mx-4 space-y-2">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-wsemibold text-[16px] text-[#DFE3EC]">
                            {ticketTypeData.name + " ticket"}
                        </Text>
                        <View className="flex-row gap-2 items-center mr-2">
                            <StockIcon width={24} height={24} />
                            <Text className="font-wsemibold text-[16px] text-[#C1C8D7]">
                                {ticketData.user_asks.length}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <View className="min-w-[110px] min-h-[50px] bg-[#24242D] items-center justify-center rounded-lg">
                            <Text className="font-wregular text-[16px] text-[#C1BBF6]">
                                Lowest ask
                            </Text>
                            <Text className="font-wsemibold text-[24px] text-white">
                                {ticketData.user_asks.length == 0 ? "---" : "£" + Math.min(...ticketData.user_asks.map(ask => parseFloat(ask.price)))}
                            </Text>
                        </View>

                        <View className="min-w-[110px] min-h-[50px] bg-[#24242D] items-center justify-center rounded-lg">
                            <Text className="font-wregular text-[16px] text-[#C1BBF6]">
                                Highest offer
                            </Text>
                            <Text className="font-wsemibold text-[24px] text-white">
                            {ticketData.user_asks.length == 0 ? "---" : "£" + Math.max(...ticketData.user_offers.map(ask => parseFloat(ask.price)))}
                            </Text>
                        </View>
                    </View>
                </View>
                
            </View>
        )
    }
}

export default TicketWidget
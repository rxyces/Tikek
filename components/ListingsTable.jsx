import { View, Text, FlatList } from 'react-native'
import { useEffect, useState } from 'react'


const ListingsTable = ({listingData, ascending}) => {

    const [ tableData, setTableData ] = useState(null)

    useEffect(() => {
        const aggregatedData = listingData.reduce((result, listing) => {
            const price = listing.price
            if (!result[price]) {
                result[price] = { id: price, price: price, quantity: 0}
            }
            result[price].quantity += 1
            return result
        }, {})
        const sortedData = Object.values(aggregatedData).sort((a, b) => {
            if (ascending) {
                return parseFloat(a.price) - parseFloat(b.price)
            }
            else {
                return parseFloat(b.price) - parseFloat(a.price)
            }
        })
        setTableData(Object.values(sortedData))
    }, [listingData])

    const renderItem = ({item ,index }) => {
        return (
            <View className={`flex-row items-center py-1 ${index % 2 == 0 ? "bg-[#24242D]" : ""}`}>
                <Text className="font-wregular text-[#C1BBF6] text-[16px] text-center w-1/2" numberOfLines={1} ellipsizeMode='tail'>
                    {"£" + item.price}
                </Text>
                <Text className="font-wregular text-[#ADB3C1] text-[16px] text-center w-1/2" numberOfLines={1} ellipsizeMode='tail'>
                    {item.quantity}
                </Text>
            </View>
        )
    }



    if (!tableData || tableData.length == 0) {
        return (
            <View className="h-[135px] rounded-lg border-2 border-[#C6D8FF]">
                <View className="min-w-full flex-1 items-center justify-center">
                    <Text className="font-wsemibold text-[#DFE3EC] text-[20px] text-center">
                        No data yet
                    </Text>
                </View>
            </View>
        )
    }
    else {
        return (
            <View className="h-[135px] rounded-lg border-2 border-[#C6D8FF]">
                <View className="flex-row items-center justify-between mt-2">
                    <Text className="font-wmedium text-[#C1C8D7] text-[16px] text-center w-1/2">
                        Price
                    </Text>
                    <Text className="font-wmedium text-[#C1C8D7] text-[16px] text-center w-1/2">
                        Quantity
                    </Text>
                </View>
                <FlatList
                data={tableData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                className="w-full mt-2 rounded-lg"
                />
            </View>
        )
    }
}

export default ListingsTable
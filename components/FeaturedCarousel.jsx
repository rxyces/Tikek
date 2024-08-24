import { useRef, useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { format } from "date-fns"

import Error from './Error';
import { getRecords } from '../utils/dataRetrieval';
import DateIcon from "../assets/svgs/date_icon.svg"
import PriceIcon from "../assets/svgs/price_icon.svg"
import LocationIcon from "../assets/svgs/location_icon.svg"
import RightSelector from "../assets/svgs/right_selector.svg"

const { width: screenWidth } = Dimensions.get('window');

const FeaturedCarousel = () => {
    //states
    const [index, setIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [errorText, setErrorText] = useState("")
    const [featuredData, setFeaturedData] = useState(null)

    const isCarousel = useRef(null)

    //loading image
    const source = require("../assets/images/loading_placeholder.png")

    useEffect(() => {
        setErrorText("")
        getRecords({ dbName: "featured" }).then(({data, error}) => {
            if (!error) {
                setFeaturedData(data)
            }
            else {
                setErrorText(error)
            }
            
            setIsLoading(false)
        }
        )
    }, [])

    const renderItem = ({ item }) => (
        <View className="items-center flex-1">
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
                                From £999
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
        </View>
        

    );

    return (
        <View className="w-5/6 h-[360px] rounded-lg border-2 border-[#C6D8FF] p-2">
            {errorText ? 
            <Error errorText={errorText}/> : isLoading ? "" : (
            <View className="items-center flex-1">
                <View className="flex-row items-center justify-center relative my-4 w-11/12">
                    <Text className="font-wregular text-[20px] text-[#DFE3EC] absolute left-0">
                        Featured
                    </Text>

                    <Pagination
                        dotsLength={featuredData.length}
                        activeDotIndex={index}
                        carouselRef={isCarousel}
                        dotStyle={{
                        width: 7,
                        height: 7,
                        backgroundColor: '#C6D8FF'
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        containerStyle={{ 
                            paddingHorizontal: 0,
                            paddingVertical: 0,
                        }}
                        dotContainerStyle={{ 
                            marginHorizontal: 4,
                        }}
                    />
                </View>
                
                <Carousel
                    data={featuredData}
                    ref={isCarousel}
                    loop={true}
                    onSnapToItem={(index) => setIndex(index)}
                    renderItem={renderItem}
                    sliderWidth={screenWidth / 6 * 5}
                    itemWidth={screenWidth  / 6 * 5}
                    layout={'default'}
                    />
            </View>
            )}
        </View>
    );
    };

export default FeaturedCarousel
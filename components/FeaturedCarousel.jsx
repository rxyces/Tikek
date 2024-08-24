import { useRef, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import DateIcon from "../assets/svgs/date_icon.svg"
import PriceIcon from "../assets/svgs/price_icon.svg"
import LocationIcon from "../assets/svgs/location_icon.svg"
import RightSelector from "../assets/svgs/right_selector.svg"

const { width: screenWidth } = Dimensions.get('window');

const dummyData = [
    { title: "The Halloween Rave 2024", date: "Oct, 31st", price: "From £6.50", location: "Ministry of Sound", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDIzLzEwLzMvMTcvNDgvMjIvMzQ5LzM4Mzk5NjkyMV82NDE0NzkwMDA4NjQ4ODY4XzQ0MzYzOTg5NDQxMjU1NjQyNzlfbi5qcGciXV0?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
    { title: "WE LOVE MANCHESTER FRESHERS", date: "Sep, 14th", price: "From £9", location: "Multiple Venues, Manchester", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDI0LzgvMTUvMTMvMjkvNTkvNDA0L1JpZmYtUmFmZi1NTVUtMjAyNC1IZWF0aGVyLUJvd2xpbmcuanBlZyJdXQ?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
    { title: "Old School Hip-Hop Outdoor Summer BBQ", date: "Sun, 25th", price: "From £7.30", location: "SWG3 Glasgow", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDI0LzUvMjQvMTcvNTUvNi83MDkvR2luLSYtSnVpY2UtR2xhc2dvdy0tLUZhdHNvbWEuanBnIl1d?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
    { title: "The Halloween Rave at Fabric!", date: "Oct, 31st", price: "From £11.20", location: "fabric London", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDI0LzQvMTkvMTMvNDIvMy82MDAvVGhlLUhhbGxvd2Vlbi1SYXZlLS0tRmF0c29tYS5qcGciXV0?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
    { title: "KCL - London Freshers Week 2024", date: "Sep, 14th", price: "From £22.50", location: "Best Superclubs in, London", image: "https://fatsoma.imgix.net/W1siZiIsInB1YmxpYy8yMDI0LzgvMTQvMTIvMzUvMTkvMTU0L1doYXRzQXBwIEltYWdlIDIwMjQtMDgtMTQgYXQgMTMuMzQuMDAgKDEpLmpwZWciXV0?w=768&h=432&fit=fillmax&fill=blur&auto=format%2Ccompress"},
];

const FeaturedCarousel = ({ data }) => {
    const [index, setIndex] = useState(0)
    const isCarousel = useRef(null)

    const renderItem = ({ item }) => (
        <View className="items-center flex-1">
            <View className="w-11/12 flex-1">
                <View className="h-[170px]">
                    <Image
                    className="flex-1 rounded-xl"
                    source={item.image}
                    contentFit="cover"
                    />
                </View>
                <Text className="font-wsemibold text-[20px] text-[#DFE3EC] my-2" numberOfLines={1} ellipsizeMode='tail'>
                    {item.title}
                </Text>
                <View className="">
                    <View className="flex-row gap-2 items-center">
                        <DateIcon width={24} height={24} />
                        <Text className="font-wregular text-[16px] text-[#C1C8D7]" numberOfLines={1} ellipsizeMode='tail'>
                            {item.date}
                        </Text>
                    </View>
                    <View className="flex-row items-center py-1 justify-between">
                        <View className="items-center flex-row gap-2">
                            <PriceIcon width={24} height={24} />
                            <Text className="font-wregular text-[16px] text-[#C1BBF6]" numberOfLines={1} ellipsizeMode='tail'>
                                {item.price}
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
            <View className="items-center flex-1">
                <View className="flex-row items-center justify-center relative my-4 w-11/12">
                    <Text className="font-wregular text-[20px] text-[#DFE3EC] absolute left-0">
                        Featured
                    </Text>

                    <Pagination
                        dotsLength={dummyData.length}
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
                    data={dummyData}
                    ref={isCarousel}
                    loop={true}
                    onSnapToItem={(index) => setIndex(index)}
                    renderItem={renderItem}
                    sliderWidth={screenWidth / 6 * 5}
                    itemWidth={screenWidth  / 6 * 5}
                    layout={'default'}
                    />
            </View>
        </View>
    );
    };

export default FeaturedCarousel
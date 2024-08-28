import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';

import Error from '../../../../components/Error';
import { getRecords } from '../../../../utils/dataRetrieval';
import { useAuthenticatedContext } from '../../../../context/AuthenticatedContext';

const eventPage = () => {
    const { id } = useLocalSearchParams();

    //states
    const [currentEventDetails, setCurrentEventDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorText, setErrorText] = useState("")

    //context
    const { allEventData, setAllEventData } = useAuthenticatedContext()

    //loading image
    const source = require("../../../../assets/images/loading_placeholder.png")

    useEffect(() => {
        setErrorText("")
        const eventExists = allEventData.some(event => event.id == id)
        if (eventExists) {
            const eventDetails = allEventData.find(event => event.id == id)
            setCurrentEventDetails(eventDetails)
            setIsLoading(false)
        }
        else {
            getRecords().then(({data, error}) => {
                if (!error) {
                    setCurrentEventDetails(data)
                    setAllEventData(prevData => {
                        const uniqueNewData = data.filter(item => !prevData.some(existingItem => existingItem.id == item.id))
                        return [...prevData, ...uniqueNewData]
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

    return (
        <View>
            <Text className="text-3xl text-white">{id}</Text>
        </View>
    )
}

export default eventPage
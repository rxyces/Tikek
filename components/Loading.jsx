import { View } from 'react-native'
import LoadingIcon from "../assets/svgs/loading.svg";


//loading screen
const Loading = () => {
    return (
    <View className="flex-1 justify-center items-center">
        <LoadingIcon width={90} height={105} />
    </View>
    )
}

export default Loading;
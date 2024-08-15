import { Text } from 'react-native';

// show server errors
const Error = ({ errorText }) => {
    if (errorText) {
        return (
        <Text className="font-wregular text-[14px] text-[#E11414] m-4 text-center">
            {errorText}
        </Text>
        );
    } else { 
        return null;
    }
};

export default Error;

import { View, Text } from 'react-native'
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, withTiming, Easing  } from 'react-native-reanimated';


const PasswordStrengthMeter = ( { password }) => {
    const initialCriteria = {
        tooShort: "Too short",
        containsLowercase: "Must contain lowercase",
        containsUppercase: "Must contain uppercase",
        containsNumbers: "Must contain numbers",
        containsSpecialChars: "Must contain special characters",
    };

    const [criteria, setCriteria] = useState(initialCriteria);
    const [passwordStrength, setPasswordStrength] = useState(0)

    //aniamtion values
    const width = useSharedValue("0%")
    const backgroundColor = useSharedValue("#2B2E34")

    const updatePasswordCriteria = () => {
        //creates new immutable object because doing updatedCriteria=initalCriteria just creates a reference to the orignal object not a new copy
        let updatedCriteria = { ...initialCriteria };

        if (password.length >= 8) {
            delete updatedCriteria.tooShort;
        }
        if (/[a-z]/.test(password)) {
            delete updatedCriteria.containsLowercase;
        }
        if (/[A-Z]/.test(password)) {
            delete updatedCriteria.containsUppercase;
        }
        if (/\d/.test(password)) {
            delete updatedCriteria.containsNumbers;
        }
        if (/[^A-Za-z0-9]/.test(password)) {
            delete updatedCriteria.containsSpecialChars;
        }
        setPasswordStrength(5 - Object.keys(updatedCriteria).length)
        setCriteria(updatedCriteria)
    }

    //different colours depending on pw strength
    const determineBarColour = () => {
        switch (passwordStrength) {
            case 1:
                return "#ADB3C1"
            case 2:
                return "#D57861"
            case 3:
                return "#D59B61"
            case 4:
                return "#CDD561"
            case 5:
                return "#61D565"
            default:
                return "#2B2E34"
        }
    }

    //everytime user types new password check if any new criteria can be listed off and the pw strength increased
    useEffect(updatePasswordCriteria, [password])

    //animation for when there needs to be a change of colour and width of the bar
    useEffect(() => {
        width.value = withTiming(`${20 * passwordStrength}%`, {
            duration: 600,
            easing: Easing.inOut(Easing.quad),
        })
        backgroundColor.value = withTiming(determineBarColour(), {
            duration: 300,
            easing: Easing.inOut(Easing.quad),
        })
    }, [passwordStrength])

    return (
        <View>
            {/* the password bar meter */}
            <View className="flex-row w-[320px] h-[6px] rounded-2xl bg-[#2B2E34]">
                <Animated.View
                        style={{
                        width,
                        backgroundColor ,
                        }}
                        className="rounded-2xl h-[6px]"
                    />
            </View>
            {/* show the top value of the criteria as that should be the thing the user should add next */}
            <Text className="font-wregular text-[12px] text-[#DFE3EC] mt-2">
                {passwordStrength == 5 ? "Strong password" : Object.values(criteria)[0]}
            </Text>
        </View>
    )
}

export default PasswordStrengthMeter
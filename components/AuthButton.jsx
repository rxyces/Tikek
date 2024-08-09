import { View, Text, StyleSheet, Pressable } from 'react-native'


//button on sign up and login pages
const AuthButton = ({ onPress, text, bgColor, shadowColor, disabled=false }) => {
    const styles = StyleSheet.create({
        shadow: {
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 6,
            },
    });
    return (
        <Pressable
        style={({ pressed }) => [
            { opacity: pressed ? 0.8 : 1 },
            { paddingHorizontal: 64, paddingVertical: 16, marginHorizontal: -64, marginVertical: -16 },
        ]}
        onPress={onPress}
        disabled={disabled}>
            <View className={`justify-center items-center w-[300px] min-h-[50px] max-h-[50px] rounded-2xl`} style={[styles.shadow, { backgroundColor: bgColor }, disabled ? {opacity: 0.7} : {}]}>
                <Text className="font-wsemibold text-[16px] text-white">
                    {text}
                </Text>
            </View>
        </Pressable>
    )
}

export default AuthButton


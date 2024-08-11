import { createContext, useContext, useState } from "react";

const signInContext = createContext()

export function useSignInContext() {
    const context = useContext(signInContext);

    if (!context) {
        throw new Error("useSignInContext must be contained within signInContext")
    }

    return context;
}

// context around whole sign in process
const SignInContext = ( { children }) => {
    const [selectedCountryNumber, setSelectedCountryNumber] = useState("+44");
    const [phoneNum, setPhoneNum] = useState("");
    const [formattedPhoneNum, setFormattedPhoneNum] = useState("");

    return (
        <signInContext.Provider value={{
            selectedCountryNumber, setSelectedCountryNumber,
            phoneNum, setPhoneNum,
            formattedPhoneNum, setFormattedPhoneNum,
        }}>
        {children}
        </signInContext.Provider>
    )
}

export default SignInContext
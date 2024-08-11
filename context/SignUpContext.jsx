import { createContext, useContext, useState } from 'react'

//context around teh whole sign up process so all pages have access to user details
const signUpContext = createContext()

export function useSignUpContext() {
    const context = useContext(signUpContext);
    
    if (!context) {
        throw new Error("useSignUpContext must be contained within signUpContext");
    }

    return context;
}

const SignUpContext = ( {children}) => {
    const [selectedCountryNumber, setSelectedCountryNumber] = useState("+44");
    const [phoneNum, setPhoneNum] = useState("");
    const [formattedPhoneNum, setFormattedPhoneNum] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");

    return (
        <signUpContext.Provider value={{ 
            phoneNum, setPhoneNum, 
            selectedCountryNumber, setSelectedCountryNumber, 
            formattedPhoneNum, setFormattedPhoneNum,
            emailAddress, setEmailAddress,
            fullName, setFullName,
            password, setPassword
            }}>
            {children}
        </signUpContext.Provider>
    )
}

export default SignUpContext
import { createContext, useContext, useState } from "react";

const authenticatedContext = createContext()

export function useAuthenticatedContext() {
    const context = useContext(authenticatedContext);

    if (!context) {
        throw new Error("useSignInContext must be contained within signInContext")
    }

    return context;
}

// context around whole authenticated users to store retrieved data
const AuthenticatedContext = ( { children }) => {
    const [allEventData, setAllEventData] = useState([])

    return (
        <authenticatedContext.Provider value={{
            allEventData, setAllEventData,
        }}>
        {children}
        </authenticatedContext.Provider>
    )
}

export default AuthenticatedContext
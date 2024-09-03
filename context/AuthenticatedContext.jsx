import { createContext, useContext, useState } from "react";

const authenticatedContext = createContext()

export function useAuthenticatedContext() {
    const context = useContext(authenticatedContext);

    if (!context) {
        throw new Error("useAuthenticatedContext must be contained within authenticatedContext")
    }

    return context;
}

// context around whole authenticated users to store retrieved data
const AuthenticatedContext = ( { children }) => {
    const [allEventData, setAllEventData] = useState([])
    const [allTicketData, setAllTicketData] = useState([])

    return (
        <authenticatedContext.Provider value={{
            allEventData, setAllEventData,
            allTicketData, setAllTicketData,
        }}>
        {children}
        </authenticatedContext.Provider>
    )
}

export default AuthenticatedContext
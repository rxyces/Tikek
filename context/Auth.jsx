import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const authContext = createContext()

export function useAuthContext() {
    const context = useContext(authContext);

    if (!context) {
        throw new Error("useAuthContext must be contained within authContext")
    }

    return context;
}

// context to provide session data to whole app
const AuthContext = ( { children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [completedEmail, setCompletedEmail] = useState(false)
    const [completedCity, setCompletedCity] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            let completionData = {
                completedEmail: false,
                completedCity: false,
                isAuthenticated: false,
            }
            const {error: getUserError} = await supabase.auth.getUser()
            if (!getUserError) {
                const { data, error: getSessionError } = await supabase.auth.refreshSession()
                if (!getSessionError) {

                    completionData.isAuthenticated = true // means user exists at least in auth db now need to check if they have finished sign up or are they just logging in
                    
                    //checks if sign up has been fully completed
                    if (data.user.new_email || data.user.email) completionData.completedEmail = true //else email part hasnt been finished so neither will the city

                    const { data: cityData, error: getCityError } = await supabase
                    .from('profiles')
                    .select('city')
                    .eq("id", data.user.id)
                    if (!getCityError) {
                        
                        if (cityData[0].city) completionData.completedCity = true //else city part hasnt been completed yet
                        
                    }   else console.error(JSON.stringify(getCityError, null, 2))

                }   else console.error(JSON.stringify(getSessionError, null, 2))
            }
            //will return an auth session missing error if user hasnt started sign in at all
            else if (getUserError.name !== "AuthSessionMissingError") {
                console.error(JSON.stringify(getUserError, null, 2))
            }
            
            return completionData
        }
        setIsLoaded(false)
        checkUser().then((data) => {
            setCompletedEmail(data.completedEmail)
            setCompletedCity(data.completedCity)
            setIsAuthenticated(data.isAuthenticated)
            setIsLoaded(true)
        })
        
    }, [isAuthenticated])

    return (
        <authContext.Provider value={{
            isAuthenticated, setIsAuthenticated,
            isLoaded, setIsLoaded,
            completedEmail, setCompletedEmail,
            completedCity, setCompletedCity,
        }}>
        {children}
        </authContext.Provider>
    )
}

export default AuthContext
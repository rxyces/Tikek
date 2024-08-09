import { useEffect, useState, useContext, createContext } from 'react'
import * as SecureStore from 'expo-secure-store';


const USERKEY = "user_key"
const authContext = createContext()

export function useAuth () {
    const context = useContext(authContext);
    
    if (!context) {
        throw new Error("useAuth must be contained within Auth")
    }

    return context
}

const Auth = ( { children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        loadLocalStorage()
    }, [])

    async function loadLocalStorage () {
        await new Promise(r => setTimeout(r, 2000))
        try {
            const authDataSerialized = await SecureStore.getItemAsync(USERKEY);
            if (authDataSerialized) {
                const authData = JSON.parse(authDataSerialized);
                setUserData(authData)
                setIsAuthenticated(false)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    const signIn = async () => {
        //some stuff to do login and gen token
        const authData = {
            "email": "testing@gmail.com",
            "password": "yay",
            "token": "12345"
        }
        setUserData(authData)
        setIsAuthenticated(true)
        await SecureStore.setItemAsync(USERKEY, JSON.stringify(authData))
    }

    const signOut = async () => {
        setUserData(null)
        setIsAuthenticated(false)
        await SecureStore.deleteItemAsync(USERKEY)
    } 


    return (
        <authContext.Provider value={{isLoading, isAuthenticated, userData, signIn, signOut}}>
            {children}
        </authContext.Provider>
    )
}

export default Auth
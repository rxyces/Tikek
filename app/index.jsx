import {  Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import Loading from '../components/Loading';
import { useAuthContext } from '../context/Auth';




const AuthLoader = () => {
    const { isLoaded, isAuthenticated, setIsAuthenticated, completedEmail, setCompletedEmail, completedCity, setCompletedCity } = useAuthContext()

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
            console.log("signed out")
            setIsAuthenticated(false)
            setCompletedEmail(false)
            setCompletedCity(false)
        }
    })

    if (!isLoaded) {
        return (
            <Loading/>
        )
    }

    if (isAuthenticated) {
        if (completedEmail && completedCity) {
            return <Redirect href={"/Home"}/> //has made acc into auth db and filled out all details in the profiles db
        }
        else if (!completedEmail) {
            return <Redirect href={"/AccountDetails"}/> // verified number but hasnt done anything else
        }
        else if (completedEmail && !completedCity) {
            return <Redirect href={"/FindCity"}/> // verified number, filled account details, but has not filled city
        }
    }
    else {
        return <Redirect href={"/Landing"}/> //no session saved at all user will need to login or sign up
    }
}   

export default AuthLoader
import {  Redirect } from 'expo-router';

import Loading from '../components/Loading';
import { useAuthContext } from '../context/Auth';


const AuthLoader = () => {
    const { isLoaded, isAuthenticated, completedEmail, completedCity, isResettingPassword } = useAuthContext()

    if (!isLoaded) {
        return (
            <Loading/>
        )
    }

    if (isAuthenticated) {
        if (completedEmail && isResettingPassword) {
            return <Redirect href={"/ResetPassword"}/>
        }
        else if (completedEmail && completedCity) {
            return <Redirect href={"/(tabsNav)/Home"}/> //has made acc into auth db and filled out all details in the profiles db
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
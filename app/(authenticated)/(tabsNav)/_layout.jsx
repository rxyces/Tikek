import { Tabs } from 'expo-router'

import HomeIcon from "../../../assets/svgs/tab_nav/home_icon.svg"
import TicketIcon from "../../../assets/svgs/tab_nav/ticket_icon.svg"
import SearchIcon from "../../../assets/svgs/tab_nav/search_icon.svg"
import AccountIcon from "../../../assets/svgs/tab_nav/account_icon.svg"

const TabLayout = () => {
    return (
        <Tabs
        sceneContainerStyle={{ backgroundColor: '#131316' }}
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#C6D8FF',
            tabBarInactiveTintColor: '#EEF0F4',
            tabBarIndicatorStyle: { backgroundColor: '#ADB3C1' },
            tabBarStyle: { backgroundColor: '#131316', paddingBottom: 0, position: "absolute", },
            tabBarItemStyle: { justifyContent: 'center'},
        }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                title: '',
                tabBarIcon: ({color}) => <HomeIcon width={40} length={40} style={{ color: color }}/>
                ,
                }}
            />
            <Tabs.Screen
                name="Tickets"
                options={{
                title: '',
                tabBarIcon: ({color}) => <TicketIcon width={40} length={40} style={{ color: color }}/>
                ,
                }}
            />
            <Tabs.Screen
                name="Search"
                options={{
                title: '',
                tabBarIcon: ({color}) => <SearchIcon width={40} length={40} style={{ color: color }}/>,
                }}
            />
            <Tabs.Screen
                name="Account"
                options={{
                title: '',
                tabBarIcon: ({color}) => <AccountIcon width={40} length={40} style={{ color: color }}/>
                ,
                }}
            />
        </Tabs>
    );
}

export default TabLayout
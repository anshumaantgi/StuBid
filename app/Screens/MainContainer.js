import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Homepage from './Homepage';
import Notificationpage from './Notificationpage';
import MyProfilepage from './MyProfilepage';
import colors from '../config/colors';
import { View , Dimensions} from 'react-native';
import Auction1 from './Auction1';
import Auction2 from './Auction2';

//Screen names
const homeName = "Home";
const AuctionName = "Auction";
const NotificationName = "Notification";
const MyProfileName = "My Profile";

//height of screen
const windowHeight = Dimensions.get('window').height;

const Tab = createBottomTabNavigator();
export const FilterContext = React.createContext();

function MainContainer({route, navigation}) {

  return (
    <FilterContext.Provider value = {route.params}>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === AuctionName) {
              iconName = focused ? 'add-circle' : 'add-circle-outline';

            } else if (rn === NotificationName) {
              iconName = focused ? 'notifications' : 'notifications-outline';

            } else if (rn === MyProfileName) {
                iconName = focused ? 'person' : 'person-outline';
              }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor : colors.gold,
          tabBarInactiveTintColor : colors.white,
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: {
            fontSize: 12,
          },
         
          tabBarStyle: {
            height: windowHeight/10,
            paddingHorizontal: 20,
            padding: 10,
            backgroundColor: colors.darkbrown,
            position: 'absolute',
           
        },
        })}
       >
        <Tab.Screen name={homeName} component={Homepage}/>
        <Tab.Screen 
          name={AuctionName} 
          component={View}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();
    
              // Do something with the `navigation` object
              navigation.navigate("Auction1"); // Here!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            },
          })}
        />
        <Tab.Screen name={NotificationName} component={Notificationpage} />
        <Tab.Screen name={MyProfileName} component={MyProfilepage} />

      </Tab.Navigator>
    </FilterContext.Provider>
  );
}

export default MainContainer;
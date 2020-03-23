import React from 'react';

import MainScreen from '../screens/MainScreen'
import SettingsScreen from '../screens/SettingsScreen'
import LoginScreen from '../screens/LoginScreen'
import MapScreen from '../screens/MapScreen'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import * as firebase from 'firebase';


import {firebaseConfig} from '../config';

firebase.initializeApp(firebaseConfig);


const Tab = createBottomTabNavigator();
const InternalStack = createStackNavigator();
const MainStack = createStackNavigator();

function MainApp(props) {
  return (
    <NavigationContainer>
        <MainStack.Navigator>
            {!props.isLoggedIn ?
            <MainStack.Screen name ="login" component={LoginScreen}  options={{ headerShown: false }}/>
            :
            <MainStack.Screen name ="MainTab" component={TabNavigator}  options={{ headerShown: false }}/>
        }
        </MainStack.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProps = (state) =>{
    // console.log(state)
    return {isLoggedIn: state.isLoginReducer.isLoggedIn}
}

export default connect(mapStateToProps)(MainApp)

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions = {({route}) => ({
                tabBarIcon : ({ color, size }) => {
                    let iconName; 

                    route.name === "Home" ? iconName = "md-home" : iconName = "md-settings"

                    return <Ionicons name={iconName} size={size} color={color} />;
                
                },

            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
            >

            <Tab.Screen name="Home" component={StackNavigator} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    )
}

const StackNavigator = () => {
    return (
        <InternalStack.Navigator>
            <InternalStack.Screen 
            name="Home" 
            component={MainScreen} 
            options={{ headerShown: false }}/>
            <InternalStack.Screen 
            name="Map"
            component={MapScreen}
            /> 
        </InternalStack.Navigator>
    )
}


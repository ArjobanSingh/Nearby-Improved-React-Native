import React, {useState, useEffect} from 'react';
import {  Platform,View, AppState, StyleSheet } from 'react-native';
import NearbyScreen from './NearbyScreen'
import SearchScreen from './SearchScreen'

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import {connect} from 'react-redux';
import {addLocation, removeLocation, searchData} from '../redux/actions'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();


function MyTabs(props) {
  return (
    <Tab.Navigator
      lazy={true}>
      <Tab.Screen name="Nearby">
        {navigationProps => 
            <NearbyScreen 
                {...navigationProps}
                someData={props.someData}
                pressStatus={props.pressStatus}
                text={props.text}
                isMounted={props.isMounted}
                setPressStatus={props.setPressStatus}
                openMapScreen={props.openMapScreen} 
            />
        }
      </Tab.Screen>
      <Tab.Screen name="Search">
        {navigationProps => 
            <SearchScreen 
                {...navigationProps}
                someData={props.someData}
                pressStatus={props.pressStatus}
                text={props.text}
                isMounted={props.isMounted}
                setPressStatus={props.setPressStatus}
                openMapScreen={props.openMapScreen} 
            />
        }
      </Tab.Screen>
    </Tab.Navigator>
  );
}


const HomeScreen = ({addLocation, removeLocation, userLocation, searchData, navigation }) => {
    const [errorMessage, setErrorMessage] = useState(null) 
    const [appState, setAppState] = useState(AppState.currentState) 
    const [pressStatus, setPressStatus] = useState(false)

    let isMounted;

    const search = async() => {
      console.log(userLocation)
      lat = userLocation.coords.latitude
      long = userLocation.coords.longitude
      radius = 3000
      query = 'hospitals'
      // console.log(lat, long)
      const resp = await searchData(lat, long, radius, query)
    }


    useEffect(() => {
        isMounted = true;
        AppState.addEventListener('change', handleAppStateChange)
        if (Platform.OS === 'android' && !Constants.isDevice) {
            {isMounted ? setErrorMessage(
              'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            ): undefined}
          } else {
            (async() => await _getLocationAsync())()
            
          }
        console.log("didmount")  


        return (() => {
            isMounted = false;
            AppState.removeEventListener('change', handleAppStateChange)
            removeLocation()
        })
    }, [])

    const handleAppStateChange = async(nextAppState) => {
        if (
            appState.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            console.log('App has come to the foreground!');
            await getLocationAsync();
          }
          {isMounted ? setAppState(nextAppState) : undefined};
        }

    const _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          setErrorMessage(
            'Permission to access location was denied',
          )
          return
        }
    
        let thisLocation = await Location.getCurrentPositionAsync({});
        addLocation(thisLocation)
        // await search();
      };


    const someData = async() => {
        if (await Location.hasServicesEnabledAsync()){
            console.log("Enabled")
            return
        }
        else {
            console.log("Enable Location")
        }
    }

    const openMapScreen = () =>{
      navigation.navigate('Map')
    }

    let text = 'Waiting..';
    if (errorMessage) {
      text = errorMessage;
    } else if (userLocation) {
      text = JSON.stringify(userLocation);
    }

    return (
      <View style={styles.container}>
        <MyTabs 
        someData={someData}
        pressStatus={pressStatus}
        text={text}
        isMounted={isMounted}
        setPressStatus={setPressStatus}
        openMapScreen={openMapScreen}
      />
      </View>
    )
} 


const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: Constants.statusBarHeight,
  }
})



  const mapStateToProps = (state) =>{
      return {
          userLocation: state.mapReducer
      }
  }
  export default connect(mapStateToProps, {removeLocation, addLocation, searchData})(HomeScreen);  
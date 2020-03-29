import React, {useState, useEffect} from 'react';
import {  Platform,View, AppState, StyleSheet, Text } from 'react-native';
import NearbyScreen from './NearbyScreen'
import SearchScreen from './SearchScreen'

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import {connect} from 'react-redux';
import {addLocation, removeLocation,  locationError, noLocationError} from '../redux/actions'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

let isMounted;
const HomeScreen = ({addLocation, removeLocation, userLocation, navigation, locationError, noLocationError, locationErr }) => {
    const [errorMessage, setErrorMessage] = useState(null) 
    const [appState, setAppState] = useState(AppState.currentState) 
    const [pressStatus, setPressStatus] = useState(false)
    const [loading, setLoading] = useState(true)





    useEffect(() => {
      console.log("STARTED MOUNTING")
        isMounted = true;
        AppState.addEventListener('change', handleAppStateChange)
        if (Platform.OS === 'android' && !Constants.isDevice) {
            {isMounted ? setErrorMessage(
              'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            ): undefined}
          } else {
            (async() => await _getLocationAsync())()
            
          }


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
          locationError('Permission to access location was denied')
          setLoading(false)
          // setErrorMessage(
          //   'Permission to access location was denied',
          // )
          return
        }
        
        let thisLocation = await Location.getCurrentPositionAsync({});
        addLocation(thisLocation)
        noLocationError()
        setLoading(false)
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
        {loading? <Text>Loading...</Text> :
        locationErr.error ?
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>We need your location for app. Give location permission!</Text> 
        </View>
        :
        <MyTabs 
        someData={someData}
        pressStatus={pressStatus}
        text={text}
        isMounted={isMounted}
        setPressStatus={setPressStatus}
        openMapScreen={openMapScreen}
        _getLocationAsync={_getLocationAsync}
      /> 
        }
        {/* {locationErr.error === false?
        <MyTabs 
        someData={someData}
        pressStatus={pressStatus}
        text={text}
        isMounted={isMounted}
        setPressStatus={setPressStatus}
        openMapScreen={openMapScreen}
        _getLocationAsync={_getLocationAsync}
      /> 
      :locationErr.error === false? <Text>Loading...</Text> :
      <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>We need your location for app. Give location permission!</Text> 
      </View>
      } */}
      </View>

    )
} 


const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: Constants.statusBarHeight,
  }
})


function MyTabs(props) {
  return (

    <Tab.Navigator
      lazy={true}
      swipeEnabled={false}>
      <Tab.Screen name="Nearby">
        {navigationProps => 
            <NearbyScreen 
                {...navigationProps}
                getLocation={props._getLocationAsync}
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



  const mapStateToProps = (state) =>{
      return {
          userLocation: state.mapReducer,
          locationErr: state.locationErr
      }
  }
  export default connect(mapStateToProps, {removeLocation, addLocation, locationError, noLocationError})(HomeScreen);  
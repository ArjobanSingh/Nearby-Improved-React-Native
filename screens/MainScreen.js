import React, {useState, useEffect} from 'react';
import {  Platform,View, AppState, StyleSheet, Text, ScrollView, RefreshControl, Dimensions } from 'react-native';
import NearbyScreen from './NearbyScreen'
import SearchScreen from './SearchScreen'


import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import {connect} from 'react-redux';
import {addLocation, removeLocation,  locationError, noLocationError} from '../redux/actions'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';



const Tab = createMaterialTopTabNavigator();
const {height} = Dimensions.get('window')

let isMounted;
const HomeScreen = ({addLocation, removeLocation, userLocation, navigation, locationError, noLocationError, locationErr }) => {
    const [errorMessage, setErrorMessage] = useState(null) 
    const [appState, setAppState] = useState(AppState.currentState) 
    const [pressStatus, setPressStatus] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        isMounted = true;
        AppState.addEventListener('change', handleAppStateChange)
        if (Platform.OS === 'android' && !Constants.isDevice) {
            {isMounted ? setErrorMessage(
              'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            ): undefined}
          } else {

            // async function runAsync(){
            //   await _getLocationAsync()
            // } 
            // runAsync()
            _getLocationAsync()
          }


        return (() => {
            isMounted = false;
            AppState.removeEventListener('change', handleAppStateChange)
            removeLocation()
        })
    }, [])

    const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      _getLocationAsync()

    }, [refreshing]);

    const handleAppStateChange = (nextAppState) => {
        if (
            appState.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            console.log('App has come to the foreground!');
            _getLocationAsync();
          }
          // {isMounted ? setAppState(nextAppState) : undefined};
          setAppState(nextAppState);
        }

    const _getLocationAsync = async () => {
      try{
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          locationError('Permission to access location was denied')
          setLoading(false)
          setRefreshing(false)
          // setErrorMessage(
          //   'Permission to access location was denied',
          // )
          return
        }
        
        let thisLocation = await Location.getCurrentPositionAsync({});
        addLocation(thisLocation)
        noLocationError()
        setRefreshing(false)
        setLoading(false)
        
      }
      catch(err)
      {
        let status = await Location.getProviderStatusAsync()
        if (!status.locationServicesEnabled)
        {
          locationError('Location is Disabled, Please enable the location and pull down to reload the app!')
          setLoading(false)
        }
        setRefreshing(false)
      }
      };


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
        <ScrollView 
        style={{ height: height}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <View
          style={{flex:1, alignItems: 'center', justifyContent: 'center', height: height}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>{locationErr.errMsg}</Text> 
          </View>
        </ScrollView>
        :
        <MyTabs 
        _getLocationAsync={_getLocationAsync}
        /> 
        }
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
                getLocation={props._getLocationAsync}
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
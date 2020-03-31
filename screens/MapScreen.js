import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline   } from 'react-native-maps';

import {getDirections} from '../api'

import {connect} from 'react-redux';


const MapScreen = ({userLocation, route}) => {

    useEffect(() => {
        async function runAsync(){
            await mergeLot()
        }
        runAsync()
    }, [])

    const [polylineCoords, setPolylineCoords] = useState([])
    const [x, setX] = useState(false)

    const pinColor = 'yellow';


    const {destinationGeometry, destinationName, destinationVicinity} = route.params

    const mergeLot = async() => {
        if (userLocation.coords.latitude != null && userLocation.coords.longitude !=null)
         {
            const initLocation = `${userLocation.coords.latitude},${userLocation.coords.longitude}`
            const destLoc = `${destinationGeometry.location.lat},${destinationGeometry.location.lng}`

            const [crds, xVal] = await getDirections(initLocation, destLoc)

            setX(xVal)
            setPolylineCoords(crds)
         }
    
       }

    const destination = () => {
        return {
            "accuracy": 16,
            "altitude": 0,
            "heading": 0,
            "latitude": destinationGeometry.location.lat,
            "longitude": destinationGeometry.location.lng,
            "speed": 0,
        }
    }
    return (
        <View style={styles.container} >
            <MapView 
                provider={PROVIDER_GOOGLE}
                style={styles.mapStyle} 
                initialRegion={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.0382,
                    longitudeDelta: 0.0381,
                  }}>

            {setX? 
            <Polyline
                coordinates={polylineCoords}
                strokeWidth={2}
                strokeColor="red"/>    
            : 
            <Polyline
            coordinates={[
                {latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude},
                {latitude: destinationGeometry.location.lat, longitude: destinationGeometry.location.lng},
            ]}
            strokeWidth={2}
        strokeColor="red"/>     }       

        <Marker
            coordinate={userLocation.coords}
            title="You are here"
            description="nothinhg"
            />
        <Marker
            coordinate={destination()}
            title={destinationName}
            description={destinationVicinity}
            pinColor={pinColor}
            />
            </MapView>
        </View>
    )
} 


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
  });

  const mapStateToProps = (state) =>{
    return {
        userLocation: state.mapReducer
    }
}
export default connect(mapStateToProps)(MapScreen);  
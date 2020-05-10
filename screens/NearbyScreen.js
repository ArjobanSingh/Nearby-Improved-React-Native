import React, {useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableHighlight,TouchableOpacity, 
    ActivityIndicator,Image, RefreshControl  } from 'react-native';

import {searchGooglePlaces, CONF_API_KEY} from '../api'
import { computeDistanceBetween	} from 'spherical-geometry-js';
import {connect} from 'react-redux'

import MapView, {Marker, PROVIDER_GOOGLE, Polyline   } from 'react-native-maps';
import {getDirections} from '../api'


const { width } = Dimensions.get('window')


let isScreenMounted;
const NearbyScreen = ({currentLoc, navigation, getLocation, locationErr}) => {

    const [detailsVisibility, setDetailsVisibility] = useState(false)
    const [picUrl, setPicUrl] = useState('')
    const [name, setName] = useState('')
    const [vicinity, setVicinity] = useState('')
    const [distance, setDistance] = useState(null)


    const destination = (lats, longs) => {
        return {
            "accuracy": 16,
            "altitude": 0,
            "heading": 0,
            "latitude": lats,
            "longitude": longs,
            "speed": 0,
        }
    }
    async function onPressMarker(event, url, name, vicinity){
        setDistance(null)
        setDetailsVisibility(false)
        setMarkerLineLoading(true)
        const markerInfo = event.nativeEvent;
        setDistance(distanceBetween(markerInfo.coordinate.latitude, markerInfo.coordinate.longitude));
        setDestinationLat(markerInfo.coordinate.latitude)
        setDestinationLong(markerInfo.coordinate.longitude)

        setPicUrl(url)
        setName(name)
        setVicinity(vicinity)
        await mergeLot(markerInfo.coordinate.latitude, markerInfo.coordinate.longitude)
    }


    function setMarkers(markerData){
        const pinColor = 'yellow';
        let markers = markerData.map((item) => {
            coordinateData = destination(item.geometry.location.lat, item.geometry.location.lng)
            let {photos, icon} = item;
            let url
            {photos !== undefined && photos[0].photo_reference !== undefined?
                url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&maxheight=150&photoreference=${photos[0].photo_reference}&key=${CONF_API_KEY}`:
                url = icon
            }
            return (
                <Marker
                key={item.id}
                coordinate={coordinateData}
                title={item.name}
                description={item.vicinity}
                pinColor={pinColor}
                onPress={ (event) => onPressMarker(event, url, item.name, item.vicinity)}
            />
            )
        });
        setMarkersList(markers);
    }

    const search = async(query, radius) => {
        lat = currentLoc.coords.latitude
        long = currentLoc.coords.longitude
        radius = radius
        query = query
        const resp = await searchGooglePlaces(lat, long, radius, query)
        if (resp.customError){
            {isScreenMounted? setInitialError(resp.msg): undefined}
            setInitialLoading(false)
            setInitialNoResults(false)
            return
        }
        if (resp.length === 0) 
        {   
            setInitialNoResults(true)
            return
        }
        setInitialError("")
        setInitialNoResults(false)
        switch(selected){
            
            case "HOSPITALS":
                if(isScreenMounted){
                setRealData(resp)
                setHospitalsData(resp)
                setMarkers(resp)
                setInitialLoading(false)
                isLoadingData(false)
                }
                return;
            case "POLICE":
                if(isScreenMounted){
                    setRealData(resp)
                    setPoliceData(resp)
                    setMarkers(resp)
                    isLoadingData(false)
                    }
                return;
            case "CITY ATTRACTIONS":
                if(isScreenMounted){
                    setRealData(resp)
                    setCityAttractions(resp)
                    setMarkers(resp)
                    isLoadingData(false)
                    } 
                return;
            case "STORES":
                if(isScreenMounted){
                    setRealData(resp)
                    setStoresData(resp)
                    setMarkers(resp)
                    isLoadingData(false)
                }        
                return;
            default: 
                return;                          
        }
      }
    

    useEffect(() => {
        isScreenMounted = true
        // const unsubscribe = navigation.addListener('focus', () => {
        //     console.log("NEARBY IS FOCUSED")
        //   });
        async function runAsyncFunc() { 
            await search('hospital', 3000) 
            return;
        }

        runAsyncFunc()        
        return (() => {
            isScreenMounted = false
            // unsubscribe()
        });
    }, [])

    const [selected, setSelected ] = useState("HOSPITALS")


    // temporary state for this screen only, which is not required anywhere else
    // that's why not storing in redux as it adds complexity

    const [refreshing, setRefreshing] = useState(false);
    const [realData, setRealData] = useState(null)
    const [hospitalsData, setHospitalsData] = useState(null)
    const [cityAttractions, setCityAttractions] = useState(null)
    const [policeData, setPoliceData] = useState(null)
    const [storesData, setStoresData] = useState(null)
    const [loadingData, isLoadingData] = useState(true)
    const [error, setError] = useState("")
    const [noResults, setNoResults] =useState(false)
    const [markersList, setMarkersList] = useState(null)
    const [markerLineLoading, setMarkerLineLoading] = useState(false)

    const [initialLoading, setInitialLoading] = useState(true)
    const [initialError, setInitialError] = useState("")
    const [initialNoResults, setInitialNoResults] =useState(false)
    const [destinationLat, setDestinationLat] = useState(null)
    const [destinationLong, setDestinationLong] = useState(null)

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setPolylineCoords([])
        setX(false)
        setDetailsVisibility(false)
        await getLocation()
        if (locationErr.error) {
            setRefreshing(false)
        }
        else{
            // fetch data from api
            {isScreenMounted ? isLoadingData(true) : ""}
                if(isScreenMounted){
                setSelected("HOSPITALS")
                await search('hospital', 3000)
                setPoliceData(null)
                setCityAttractions(null)
                setStoresData(null)
                isLoadingData(false)
                setInitialLoading(false)
                setRefreshing(false)
                }


        }

      }, [refreshing]);


    useEffect(() => {
        // Did this for caching
        switch(selected){
            case "HOSPITALS":
                if (hospitalsData !== null && hospitalsData.length !== 0){
                    if(isScreenMounted){
                    setRealData(hospitalsData)
                    setMarkers(hospitalsData)
                    isLoadingData(false)
                    }
                }

                break;
            case "POLICE":
                if (policeData !== null && policeData.length !== 0 ){
                    
                    
                    if(isScreenMounted){
                    setRealData(policeData)
                    setMarkers(policeData)
                    isLoadingData(false)
                    }
                } else{
                    // fetch data from api
                    {isScreenMounted ? isLoadingData(true) : ""}
                    async function runAsyncFunc() { 
                        await search('police', 3000) 
                        return;
                    }
                    runAsyncFunc()

                }
                break
            case "CITY ATTRACTIONS":
                if (cityAttractions !== null && policeData.length !== 0 ){
                    if(isScreenMounted){
                    setRealData(cityAttractions)
                    setMarkers(cityAttractions)
                    isLoadingData(false)
                    }
                } else{
                    // fetch data from api
                    {isScreenMounted? isLoadingData(true): undefined}
                    async function runAsyncFunc() { 
                        await search('tourist_attraction', 3000) 
                        return;
                    }
                    runAsyncFunc()
                }
                break
            case "STORES":
                if (storesData !== null && policeData.length !== 0 ){
                    if(isScreenMounted){
                    setRealData(storesData)
                    setMarkers(storesData)
                    isLoadingData(false)
                    }
                } else{
                    {isScreenMounted? isLoadingData(true): undefined}
                    async function runAsyncFunc() { 
                        await search('store', 3000) 
                        return;
                    }
                    runAsyncFunc()
 
                }
                break   
            default:
                break                                 
        }

    }, [selected,])


    const selectHospitals = () => {
        if (selected !== "HOSPITALS"){
            {isScreenMounted? setSelected("HOSPITALS") : undefined}
            if (isScreenMounted){
                setDetailsVisibility(false)
                setPolylineCoords([])
                setX(false)
            }
        }
        return
    }
    const selectPolice = () => {
        if (selected !== "POLICE"){
            {isScreenMounted? setSelected("POLICE") : undefined}
            if (isScreenMounted){
                setDetailsVisibility(false)
                setPolylineCoords([])
                setX(false)
            }

        }
        return
    }
    const selectCityAttractions = () => {
        if (selected !== "CITY ATTRACTIONS"){
            {isScreenMounted? setSelected("CITY ATTRACTIONS") : undefined}
            if (isScreenMounted){
                setDetailsVisibility(false)
                setPolylineCoords([])
                setX(false)
            }
        }
        return
    }
    const selectStores = () => {
        if (selected !== "STORES"){
            {isScreenMounted? setSelected("STORES") : undefined}
            if (isScreenMounted){
                setDetailsVisibility(false)
                setPolylineCoords([])
                setX(false)
            }
        }
        return
    }



    const [polylineCoords, setPolylineCoords] = useState([])
    const [x, setX] = useState(false)

    const mergeLot = async(destLat, destLong) => {
        if (currentLoc.coords.latitude != null && currentLoc.coords.longitude !=null)
         {
            const initLocation = `${currentLoc.coords.latitude},${currentLoc.coords.longitude}`
            const destLoc = `${destLat},${destLong}`

            const [crds, xVal] = await getDirections(initLocation, destLoc)
            setX(xVal)
            setPolylineCoords(crds)
         }
         setMarkerLineLoading(false)
         setDetailsVisibility(true)
       }

    const distanceBetween = (lat, long) => {
        let finalDis = computeDistanceBetween({lat: currentLoc.coords.latitude, lng: currentLoc.coords.longitude}, {lat, long})
        return Math.round(finalDis)
    }

  return (

    
    <View style={styles.container}>
        <ScrollView style={{flex: 1}} horizontal={true}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } >
            <TouchableOpacity style={{flex: 1}} onPress={selectHospitals}>
            <Text style={[styles.options, selected === "HOSPITALS"? styles.selectedOption: styles.default] }>Hospitals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={selectPolice}>
            <Text style={[styles.options, selected === "POLICE"? styles.selectedOption: styles.default] }>Police</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={selectCityAttractions}>
            <Text style={[styles.options, selected === "CITY ATTRACTIONS"? styles.selectedOption: styles.default] }>City Attractions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={selectStores}>
            <Text style={[styles.options, selected === "STORES"? styles.selectedOption: styles.default] }>Stores</Text>
            </TouchableOpacity>
        </ScrollView>
            
            {locationErr.error ? 
            
            <View style={detailsVisibility? {flex:4.5, alignItems: 'center', justifyContent: 'center'}
                :{flex:7, alignItems: 'center', justifyContent: 'center'}}>
            <Text>{locationErr.errMsg}</Text> 
            </View>
            :
            <View style={detailsVisibility?{flex:4.5}: 
                {flex:7}}>
                {initialLoading?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator style={{flex: 1}} size="large" color="#0000ff" /> 
                    </View>
                    : initialError !== "" ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>{initialError}</Text> 
                    </View> :
                    initialNoResults?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>No results</Text> 
                    </View> :
                

                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.mapStyle} 
                    initialRegion={{
                      latitude: currentLoc.coords.latitude,
                      longitude: currentLoc.coords.longitude,
                      latitudeDelta: 0.0282,
                      longitudeDelta: 0.0281,
                    }} >
                    <Marker
                        coordinate={currentLoc.coords}
                        title="You are here"
                        description="nothinhg"
                />

            {setX? 
                <Polyline
                    coordinates={polylineCoords}
                    strokeWidth={2}
                    strokeColor="red"/>    
                : 
                <Polyline
                coordinates={[
                    {latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude},
                    {latitude: destinationLat, longitude: destinationLong},
                ]}
                strokeWidth={2}
                strokeColor="red"/>     
                // undefined
                }  

                    {markersList !== null?
                    markersList: undefined}

            </MapView>


            }
            {markerLineLoading?
                <View style={{position:'absolute', 
                height:'100%',
                width:width, 
                flex: 1}}>
                    <ActivityIndicator style={{flex: 1}} size="large" color="#0000ff" /> 
                </View> :undefined}

            {loadingData ?
            <View style={styles.overlap}>
            <ActivityIndicator style={{flex: 1}} size="large" color="#0000ff" /> 
            </View>
            :error !== ""? 
            <View style={styles.overlap}>
                <Text>{error}</Text>
            </View>
            :noResults? 
            <View style={styles.overlap}>
                <Text>No results</Text>
            </View>
            :<View />
            }


        </View> 
        
        }
        {detailsVisibility?
        <View style={{height: "30%", width: width, backgroundColor: 'rgba(52, 52, 52, 0.8)', flexDirection:'row'}}>
            <View style={{height:170, width: 170, margin: 15}}>
                <Image
                    style={{width: null, height: null, flex:1}}
                    source={{uri: picUrl}}
                                />   
                </View>
                <View style={{flex:1}}>
                    <Text style={{marginVertical: 15, fontSize: 17, color: 'white',fontWeight: 'bold'}}>{name}</Text>
                    <Text style={{color: 'white'}}>{vicinity}</Text>
                    <Text style={{color:'white', marginTop:10, fontWeight:'bold'}}>Distance: {distance} Meters</Text>
                </View> 
        </View>
        : undefined}

    </View>
  )
} 


const styles = StyleSheet.create({
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: 'center',
      },
      container: {
        flex: 1,
        backgroundColor: 'white',
        // justifyContent: 'center',
      },
      mapButton : {
          height: "5%",
          width: width - 20,
          backgroundColor: 'blue',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginVertical: '2%',
          borderRadius: 50,
          paddingTop: 10,
          elevation: 7,
      },
      pressButton:{
          height: "5%",
          width: width - 50,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginVertical: '2%',
          borderRadius: 50,
          paddingTop: 10,
          elevation: 10,
      },
      innerRating:{
          marginTop: 5,
          fontWeight: 'bold',
          fontSize : 20,
          alignSelf: 'center',
          color: '#603f83ff',       
      },
      innerTextColor: {
        fontSize: 15,
        color: '#603f83ff',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    rating: {
        fontSize: 15,
        color: '#603f83ff',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginTop: 20,
    },
    imageStyle: {
        width: '95%', 
        height: '95%',

    },
    doubleSpanStyle:{ 
        height: '97%',
        marginVertical: 5,
        backgroundColor: '#c7d3d4ff',
        marginHorizontal: 7,
        borderRadius: 15,
        elevation: 4,
        padding: 5
      },
      address: {
          marginTop: 10,
          fontSize: 15
      }, 
      distance :{
          marginVertical: 20,
          fontSize: 20,
          fontWeight: 'bold'
      },
      options: {
          marginHorizontal: 10,
          marginTop: 20,
          fontWeight: "bold",
          fontSize: 20,
          height: 45,
          borderColor: '#2a4944',
          borderWidth: 1.5,
          padding: 10,
          borderRadius: 50,
          marginBottom: 20, 
      },
      selectedOption:{
        backgroundColor: 'black',
        color: 'white',
      },
      default:{
        backgroundColor: '#fff',
        color: 'black',
        elevation: 5
      },
      overlap:
      {position:'absolute', 
      height:'100%',
      width:width, 
      flex: 1, 
      backgroundColor: 'white'
        },
      mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      }
  });


const mapStateToProps = (state) => {
    return {
        currentLoc: state.mapReducer,
        locationErr: state.locationErr,
    }
}
export default connect(mapStateToProps)(NearbyScreen);  
import React, {useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableHighlight,TouchableOpacity, 
    ActivityIndicator,Image, RefreshControl  } from 'react-native';
import { RecyclerListView, DataProvider } from "recyclerlistview";
import LayoutProvider from '../LayoutProvider';

import {searchGooglePlaces} from '../api'
import { computeDistanceBetween	} from 'spherical-geometry-js';
import {connect} from 'react-redux'

import {results} from '../RawData'
import { searchData } from '../redux/actions';



const { width } = Dimensions.get('window')



const makeGoodData = () => {



    let realResults = results.map((item) => {
        return {name: item.name, type: "ITEM_SPAN_2", id: item.id, vicinity: item.vicinity, 
        rating: item.rating, icon: item.icon, geometry: item.geometry, photos: item.photos}
    })
    return realResults
}


let isScreenMounted;
const NearbyScreen = ({currentLoc, navigation, getLocation, locationErr, searchData, searchDataReducer}) => {

    const search = async(query, radius) => {
        lat = currentLoc.coords.latitude
        long = currentLoc.coords.longitude
        radius = radius
        query = query
        const resp = await searchGooglePlaces(lat, long, radius, query)
        // await searchData(lat, long, radius, query)
        // const resp = searchDataReducer
        if (resp.customError){
            {isScreenMounted? setInitialError(resp.msg): undefined}
            setInitialLoading(true)
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
                setDataProv(dataProvider.cloneWithRows(resp))
                setHospitalsData(resp)
                setInitialLoading(false)
                isLoadingData(false)
                }
                return;
            case "POLICE":
                if(isScreenMounted){
                    setDataProv(dataProvider.cloneWithRows(resp))
                    setPoliceData(resp)
                    isLoadingData(false)
                    }
                return;
            case "CITY ATTRACTIONS":
                if(isScreenMounted){
                    setDataProv(dataProvider.cloneWithRows(resp))
                    setCityAttractions(resp)
                    isLoadingData(false)
                    } 
                return;
            case "STORES":
                if(isScreenMounted){
                    setDataProv(dataProvider.cloneWithRows(resp))
                    setStoresData(resp)
                    isLoadingData(false)
                }        
                return;
            default: 
                return;                          
        }
      }
    

    useEffect(() => {
        isScreenMounted = true

        async function runAsyncFunc() { 
            await search('hospital', 2000) 
            return;
        }

        runAsyncFunc()        
        return (() => {
            isScreenMounted = false
        });
    }, [])

    const [selected, setSelected ] = useState("HOSPITALS")


    let dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });


    // temporary state for this screen only, which is not required anywhere else
    // that's why not storing in redux as it adds complexity

    const [refreshing, setRefreshing] = useState(false);
    const [dataProv, setDataProv] = useState(dataProvider.cloneWithRows([]))
    const [hospitalsData, setHospitalsData] = useState(null)
    const [cityAttractions, setCityAttractions] = useState(null)
    const [policeData, setPoliceData] = useState(null)
    const [storesData, setStoresData] = useState(null)
    const [loadingData, isLoadingData] = useState(true)
    const [error, setError] = useState("")
    const [noResults, setNoResults] =useState(false)

    const [initialLoading, setInitialLoading] = useState(true)
    const [initialError, setInitialError] = useState("")
    const [initialNoResults, setInitialNoResults] =useState(false)

    const goToMap = (geometry, name, vicinity,photos) => {
        navigation.navigate('Map', {
            destinationGeometry: geometry,
            destinationName: name,
            destinationVicinity: vicinity,
            destinationPhotos: photos
        })
    }


    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        await getLocation()
        if (locationErr.error) {
            console.log(locationErr.errMsg)
            setRefreshing(false)
        }
        else{
            // fetch data from api
            {isScreenMounted ? isLoadingData(true) : ""}
                setTimeout(() => {
                if(isScreenMounted){
                setSelected("HOSPITALS")
                setDataProv(dataProvider.cloneWithRows(makeGoodData()))
                setHospitalsData(dataProv._data)
                setPoliceData(null)
                setCityAttractions(null)
                setStoresData(null)
                isLoadingData(false)
                setInitialLoading(false)
                setRefreshing(false)
                }
            }, 2000)

        }

      }, [refreshing]);


    useEffect(() => {
        // Did this for caching
        switch(selected){
            case "HOSPITALS":
                if (hospitalsData !== null && hospitalsData.length !== 0){
                    if(isScreenMounted){
                    setDataProv(dataProvider.cloneWithRows(hospitalsData))
                    isLoadingData(false)
                    }
                }

                break;
            case "POLICE":
                if (policeData !== null && policeData.length !== 0 ){
                    
                    
                    if(isScreenMounted){
                    setDataProv(dataProvider.cloneWithRows(policeData))
                    isLoadingData(false)
                    }
                } else{
                    // fetch data from api
                    {isScreenMounted ? isLoadingData(true) : ""}
                    async function runAsyncFunc() { 
                        await search('police', 2000) 
                        return;
                    }
                    runAsyncFunc()

                }
                break
            case "CITY ATTRACTIONS":
                if (cityAttractions !== null && policeData.length !== 0 ){
                    if(isScreenMounted){
                    setDataProv(dataProvider.cloneWithRows(cityAttractions))
                    isLoadingData(false)
                    }
                } else{
                    // fetch data from api
                    {isScreenMounted? isLoadingData(true): undefined}
                    async function runAsyncFunc() { 
                        await search('tourist_attraction', 2000) 
                        return;
                    }
                    runAsyncFunc()
                }
                break
            case "STORES":
                if (storesData !== null && policeData.length !== 0 ){
                    if(isScreenMounted){
                    setDataProv(dataProvider.cloneWithRows(storesData))
                    isLoadingData(false)
                    }
                } else{
                    {isScreenMounted? isLoadingData(true): undefined}
                    async function runAsyncFunc() { 
                        await search('store', 2000) 
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
            
        }
        return
    }
    const selectPolice = () => {
        if (selected !== "POLICE"){
            {isScreenMounted? setSelected("POLICE") : undefined}

        }
        return
    }
    const selectCityAttractions = () => {
        if (selected !== "CITY ATTRACTIONS"){
            {isScreenMounted? setSelected("CITY ATTRACTIONS") : undefined}

        }
        return
    }
    const selectStores = () => {
        if (selected !== "STORES"){
            {isScreenMounted? setSelected("STORES") : undefined}

        }
        return
    }



    let layoutProvider = new LayoutProvider(dataProv)

    const distanceBetween = (lat, long) => {
        let finalDis = computeDistanceBetween({lat: currentLoc.coords.latitude, lng: currentLoc.coords.longitude}, {lat, long})
        return Math.round(finalDis)
    }

 



    let rowRenderer = (type, data) => {


        let {name, rating, vicinity, icon, geometry, photos} = data
        let helper;
        if (rating){
            helper =  parseFloat((5.0 - rating).toString().slice(0,5));
        }
        else{
            helper =  0;
            rating = 0;
        }

        switch(type){
            case "ITEM_SPAN_2":
                return(

                    <TouchableHighlight style={styles.doubleSpanStyle} onPress={() => goToMap(geometry, name, vicinity,photos)}>
                        <View style={{flex: 1}}>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                    style={styles.imageStyle}
                                    source={{uri: icon}}
                                />   
                            </View>
    
                            <View style={{flex: 2}}>
                                <Text style={styles.innerTextColor}>{name}</Text>
                                <Text style={styles.rating}>{rating > 0? `Rating: (${rating}/5)`: 'No rating'}</Text>
                                 <View style={{flexDirection: 'row'}}>
                                     <View style={{flex: rating, backgroundColor: 'red', height: 10}}></View>
                                     <View style={{flex: helper, height: 10}}></View>
                                </View>
                                <Text style={styles.address}>{`Address: ${vicinity}`}</Text>
                                <Text style={styles.distance}>{`Distance: ${distanceBetween(geometry.location.lat, geometry.location.lng)} M`}</Text>

                            </View>
                        </View>
                        
                    </TouchableHighlight>
                )
            default:
                return null;    
        }
    }



  return (

    
    <View style={styles.container} >
        <ScrollView style={{flex: 1}} horizontal={true}>
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
            <View style={{flex:7, alignItems: 'center', justifyContent: 'center'}}>
            <Text>We need your location for app. Give location permission and pull to refersh this app</Text> 
            </View>
            :
            <View style={{flex:7}}>
                {initialLoading? 
                    <ActivityIndicator style={{flex: 1}} size="large" color="#0000ff" /> :
                initialError !== "" ? 
                    <Text>{initialError}</Text> :
                initialNoResults ? 
                    <Text>No results</Text> :

                <RecyclerListView 
                layoutProvider={layoutProvider}
                dataProvider={dataProv}
                rowRenderer={rowRenderer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
            /> 
                }
            {/* {!initialLoading ? 
            <RecyclerListView 
                layoutProvider={layoutProvider}
                dataProvider={dataProv}
                rowRenderer={rowRenderer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
            /> 
            :           
            <ActivityIndicator style={{flex: 1}} size="large" color="#0000ff" /> } */}


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
        justifyContent: 'center',
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
        width: 70, 
        height: 70,

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
      backgroundColor: 'white'},
  });


const mapStateToProps = (state) => {
    return {
        currentLoc: state.mapReducer,
        locationErr: state.locationErr,
        searchDataReducer: state.searchDataReducer
    }
}
export default connect(mapStateToProps, {searchData})(NearbyScreen);  
import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableHighlight,TouchableOpacity, ActivityIndicator,Image  } from 'react-native';
import { RecyclerListView, DataProvider } from "recyclerlistview";
import LayoutProvider from '../LayoutProvider';
import * as Font from 'expo-font';

// import {calculateDistance} from '../api'
import { computeDistanceBetween	} from 'spherical-geometry-js';
import {connect} from 'react-redux'

import {results} from '../RawData'



const { width } = Dimensions.get('window')



const makeGoodData = () => {



    let realResults = results.map((item) => {
        return {name: item.name, type: "ITEM_SPAN_2", id: item.id, vicinity: item.vicinity, rating: item.rating, icon: item.icon, geometry: item.geometry}
    })
    return realResults
}



const NearbyScreen = ({currentLoc}) => {

    const [selected, setSelected ] = useState("HOSPITALS")


    let dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });;



    const [dataProv, setDataProv] = useState(dataProvider.cloneWithRows([]))
    const [hospitalsData, setHospitalsData] = useState(null)
    const [hotelsData, setHotelsData] = useState(null)
    const [attractionsData, setAttractionsData] = useState(null)
    const [placesData, setPlacesData] = useState(null)
    const [loadingData, isLoadingData] = useState(true)
    const [error, setError] = useState("")
    const [noResults, setNoResults] =useState(false)



    useEffect(() => {
        // Did this for caching
        switch(selected){
            case "HOSPITALS":
                if (hospitalsData !== null && hospitalsData.length > 0){

                    setDataProv(dataProvider.cloneWithRows(hospitalsData))
                    isLoadingData(false)
                } else{
                    // fetch data from api
                    setTimeout(() => {
                        isLoadingData(true)
                        setDataProv(dataProvider.cloneWithRows(makeGoodData()))
                        setHospitalsData(dataProv._data)
                        isLoadingData(false)
                    }, 2000)
                    setTimeout(() => {}, 2000)

                }
                break
            case "ATTRACTIONS":
                if (attractionsData !== null && hospitalsData.length > 0 ){
                    setDataProv(dataProvider.cloneWithRows(attractionsData))
                    isLoadingData(false)
                } else{
                    // fetch data from api
                    setTimeout(() => {
                        isLoadingData(true)
                        setDataProv(dataProvider.cloneWithRows(makeGoodData()))
                        setAttractionsData(dataProv._data)
                        isLoadingData(false)
                    }, 2000)
                    setTimeout(() => {}, 2000)

                }
                break
            case "HOTELS":
                if (hotelsData !== null && hospitalsData.length > 0 ){
                    setDataProv(dataProvider.cloneWithRows(hotelsData))
                    isLoadingData(false)
                } else{
                    // fetch data from api
                    setTimeout(() => {
                        isLoadingData(true)
                        setDataProv(dataProvider.cloneWithRows(makeGoodData()))
                        setHotelsData(dataProv._data)
                        isLoadingData(false)
                    }, 2000)
                    setTimeout(() => {}, 2000)

                }
                break
            case "PLACES":
                if (placesData !== null && hospitalsData.length > 0 ){
                    setDataProv(dataProvider.cloneWithRows(placesData))
                    isLoadingData(false)
                } else{
                    // fetch data from api
                    setTimeout(() => {
                        isLoadingData(true)
                        setDataProv(dataProvider.cloneWithRows(makeGoodData()))
                        setPlacesData(dataProv._data)
                        isLoadingData(false)
                    }, 2000)
                    setTimeout(() => {}, 2000)
 
                }
                break   
            default:
                break                                 
        }

    }, [selected,])

    const selectHospitals = () => {
        if (selected !== "HOSPITALS"){
            setSelected("HOSPITALS")
            
        }
        return
    }
    const selectAttractions = () => {
        if (selected !== "ATTRACTIONS"){
            setSelected("ATTRACTIONS")

        }
        return
    }
    const selectHotels = () => {
        if (selected !== "HOTELS"){
            setSelected("HOTELS")

        }
        return
    }
    const selectPlaces = () => {
        if (selected !== "PLACES"){
            setSelected("PLACES")

        }
        return
    }



    useEffect(() => {

        // setHospitalsRawData(dataProv)
        setTimeout(() =>{
            setDataProv(dataProvider.cloneWithRows(makeGoodData()))
            setHospitalsData(dataProv._data)
            isLoadingData(false)
        }, 2000)



    }, [])

    let layoutProvider = new LayoutProvider(dataProv)

    const distanceBetween = (lat, long) => {
        let finalDis = computeDistanceBetween({lat: currentLoc.coords.latitude, lng: currentLoc.coords.longitude}, {lat, long})
        return Math.round(finalDis)
    }

 



    let rowRenderer = (type, data) => {


        let {name, rating, vicinity, icon, geometry} = data
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

                    <TouchableHighlight style={styles.doubleSpanStyle} onPress={() => console.log("")}>
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
        <ScrollView horizontal={true}>
            <TouchableOpacity style={{flex: 1}} onPress={selectHospitals}>
            <Text style={[styles.options, selected === "HOSPITALS"? styles.selectedOption: styles.default] }>Hospitals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={selectAttractions}>
            <Text style={[styles.options, selected === "ATTRACTIONS"? styles.selectedOption: styles.default] }>Attractions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={selectHotels}>
            <Text style={[styles.options, selected === "HOTELS"? styles.selectedOption: styles.default] }>Hotels</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={selectPlaces}>
            <Text style={[styles.options, selected === "PLACES"? styles.selectedOption: styles.default] }>Places</Text>
            </TouchableOpacity>
        </ScrollView>
            {loadingData ?
            <ActivityIndicator style={{flex: 1}} size="large" color="#0000ff" /> 
            :error !== ""? 
            <Text>{error}</Text>
            :noResults? <Text>No results</Text>:
            <RecyclerListView 
                layoutProvider={layoutProvider}
                dataProvider={dataProv}
                rowRenderer={rowRenderer}
            /> 
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
      }
  });


const mapStateToProps = (state) => {
    return {
        currentLoc: state.mapReducer,
    }
}
export default connect(mapStateToProps)(NearbyScreen);  
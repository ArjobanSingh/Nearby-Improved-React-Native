import React, {useState, useEffect, useCallback} from 'react'
import { StyleSheet, TouchableHighlight, View, Text, Dimensions, TextInput, 
  FlatList, ActivityIndicator, RefreshControl  } from 'react-native';
import Item from '../components/Item'

import {connect} from 'react-redux';
import { searchPrdicted,removePredictedData} from '../redux/actions'
import {getLocationDetails} from '../api'

const { width } = Dimensions.get('window')

let isScreenMounted;
const SearchScreen = ({ data, searchPrdicted, userLocation,getLocation, navigation, locationErr, removePredictedData}) => {

const [query, setquery] = useState("")
const [dataAvailable, setDataAvailable] = useState(false)
const [loadingLocationData, setLoadingLocationData] = useState(false)
const [locationDataError, setlocationDataError] = useState(false)
const [errorDetail, setErrorDetail] = useState('')
const [refreshing, setRefreshing] = useState(false);
const [initialLoading, setInitialLoading] = useState(false)


useEffect(() => {
  isScreenMounted = true;
  const unsubscribe = navigation.addListener('focus', () => {
    console.log("SEARCH IS FOCUSED")
  });
 

  return (() => {
    isScreenMounted = false;
    unsubscribe()
  })
})

const onRefresh = useCallback(async () => {
  setRefreshing(true);

  await getLocation()
  if (locationErr.error) {
      setRefreshing(false)
  }
  else{
      // fetch data from api
          if(isScreenMounted){
          if (query.length > 0) {
            console.log(query)
            await searchData()}
          else removePredictedData()
          setRefreshing(false)
          }


  }

}, [refreshing]);


const goToMap = (geometry, name, vicinity,photos) => {
  navigation.navigate('Map', {
      destinationGeometry: geometry,
      destinationName: name,
      destinationVicinity: vicinity,
      destinationPhotos: photos
  })
}

const changeQuery = (innerQuery) => {
    setquery(innerQuery)
}  

// Was facing some problem with async actions in redux, so implemented directly this without redux
const openLocation = async(reference) => {
  setLoadingLocationData(true)
  const jsonResp = await getLocationDetails(reference)


      if (jsonResp.customError){
        setLoadingLocationData(false)
        setlocationDataError(true)
        setErrorDetail(jsonResp.msg)
        return
      }

        const {geometry, name, vicinity} = jsonResp
        setLoadingLocationData(false)
        setlocationDataError(false)
        setErrorDetail('')
        goToMap(geometry, name, vicinity)

      return

}

const searchData = async() =>{
  setInitialLoading(true)
    await searchPrdicted(userLocation.coords.latitude,userLocation.coords.longitude, 2000, query )
    if (data.error !== true){
        setInitialLoading(false)
        setDataAvailable(true)
        return

    }
    setInitialLoading(false)
    setDataAvailable(false)
}


  return (
    <View style={styles.container} >
        <View style={{flexDirection:'row'}}>
        <TextInput style={styles.textInput} value={query} onChangeText={changeQuery} autoFocus={true} placeholder="Search Place"/>
        <TouchableHighlight style={styles.btn} onPress={searchData}>
            <Text style={{fontWeight: "bold",}}>Search</Text>
        </TouchableHighlight>
        </View>

        {initialLoading? 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <ActivityIndicator style={{flex: 1}} size="large" color="#0000ff" /> 
            </View>
        :dataAvailable && data.data.length > 0 ?   

            <FlatList
            data={data.data}
            renderItem={({ item }) => <Item 
                                        title={item.description.split(',')[0]}
                                        description={item.description.split(',')[1]}
                                        reference={item.reference}
                                        openLocation={openLocation}/>}
            keyExtractor={item => item.place_id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            />
            : <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>No Data Available</Text>
              </View>}

        {loadingLocationData ? 
          <View style={styles.overlap}>
              <ActivityIndicator style={{flex: 1}} size="large" color="#0000ff" /> 
          </View>
        :locationDataError ?
          <View style={styles.overlap}>
            <Text>{errorDetail}</Text>
          </View>
        : <View></View>
        }    
    </View>
  )
} 


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
 
      },
      textInput :{
        width : width/ 1.4, 
        margin: 15,
        fontWeight: "bold",
        fontSize: 15,
        borderColor: '#2a4944',
        borderWidth: 1.5,
        padding: 10,
        marginBottom: 20,
      },
      btn :{
        marginTop: 15,
        borderWidth: 1.5,
        padding: 10,
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#26a0da'
      },
      mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 50
      },
      overlap: {
      position:'absolute', 
      height:'100%',
      width:width, 
      flex: 1, 
      backgroundColor: 'white'
      },
//       mapButton : {
//           height: "5%",
//           width: width - 20,
//           backgroundColor: 'blue',
//           justifyContent: 'center',
//           alignItems: 'center',
//           alignSelf: 'center',
//           marginVertical: '2%',
//           borderRadius: 50,
//           paddingTop: 10,
//           elevation: 7,
//       },
//       pressButton:{
//           height: "5%",
//           width: width - 50,
//           backgroundColor: 'black',
//           justifyContent: 'center',
//           alignItems: 'center',
//           alignSelf: 'center',
//           marginVertical: '2%',
//           borderRadius: 50,
//           paddingTop: 10,
//           elevation: 10,
//       }
   });

   const mapStateToProps = (state) =>{
    return {
        data : state.predictedDataState,
        userLocation: state.mapReducer,
        locationErr: state.locationErr,
    }
   }

export default connect(mapStateToProps, { searchPrdicted, removePredictedData})(SearchScreen);  
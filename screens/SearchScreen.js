import React, {useState} from 'react'
import { StyleSheet, TouchableHighlight, View, Text, Dimensions, TextInput, FlatList  } from 'react-native';
import Item from '../components/Item'

import {connect} from 'react-redux';
import { searchPrdicted} from '../redux/actions'

const { width } = Dimensions.get('window')


const SearchScreen = ({ data, searchPrdicted, userLocation}) => {

const [query, setquery] = useState("")
const [dataAvailable, setDataAvailable] = useState(false)

const changeQuery = (innerQuery) => {
    setquery(innerQuery)
}  

const openLocation = (reference) => {
}

const searchData = async() =>{
    await searchPrdicted(userLocation.coords.latitude,userLocation.coords.longitude, 2000, query )
    if (data.error !== true){
        setDataAvailable(true)
        return

    }
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

        {dataAvailable && data.data.length > 0 ?   

            <FlatList
            data={data.data}
            renderItem={({ item }) => <Item 
                                        title={item.description.split(',')[0]}
                                        description={item.description.split(',')[1]}
                                        reference={item.reference}
                                        openLocation={openLocation}/>}
            keyExtractor={item => item.place_id}
            />
            : <Text>No Data Available</Text>}
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
//     paragraph: {
//         margin: 24,
//         fontSize: 18,
//         textAlign: 'center',
//       },
//       container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         justifyContent: 'center',
//       },
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
        userLocation: state.mapReducer
    }
   }

export default connect(mapStateToProps, { searchPrdicted})(SearchScreen);  
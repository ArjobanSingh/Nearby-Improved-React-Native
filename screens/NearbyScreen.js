import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableHighlight, Image  } from 'react-native';
import { RecyclerListView, DataProvider } from "recyclerlistview";
import LayoutProvider from '../LayoutProvider';
import * as Font from 'expo-font';

// import {calculateDistance} from '../api'
import { computeDistanceBetween	} from 'spherical-geometry-js';
import {connect} from 'react-redux'

import {results} from '../RawData'



const { width } = Dimensions.get('window')

// class NearbyScreen extends React.Component {

//     constructor(props){
//         super(props);



        

//         this.dataProvider = new DataProvider((r1, r2) => {
//             return r1 !== r2;
//         });

//         this.layoutProvider = new LayoutProvider(
//             () => {
//                 // console.log(this.state.dataProvider.getDataForIndex(i).name)
//                 return "NORMAL"
//             }, (type, dim) => {
//                 switch (type){
//                     case "NORMAL":
//                         dim.width = width;
//                         dim.height = 160;
//                         break;
//                     default:
//                         dim.width = 0;
//                         dim.height = 0;    
//                 }
//             }
//         );

//         // let check = this.props.setRawData()
//         // this.props.provideData(dataProvider.cloneWithRows(this.props.rawData))
//         // console.log("CONSTRUCTOR", check.payload.results)

//         this.state = {
//             data : this.dataProvider.cloneWithRows([])
//         }

//     }

//     // setAndGet = () => {
//     //     myVar = setTimeout(() => results, 3000);
//     //     return myVar
//     // }

//     componentDidMount(){
//         console.log("MOUNTED IN NEARBY")
//         this.props.setRawData()
//         this.setState({data: this.dataProvider.cloneWithRows(this.props.rawData)})
//         console.log("IS IT REACHING HERE")
//     }

//     rowRenderer = (type, data) => {

//         const {name, rating, vicinity} = data
//         switch(type){
//             case "NORMAL":
//                 return(
//                     <View style={styles.cellContainer}>
//                         <Text>{name}</Text>
//                         <Text>{rating}</Text>
//                         <Text>{vicinity}</Text>
//                     </View>
//                 )
//                 break
//             case "LOADING"    :
//                 return (
//                     <Text>LOADING...</Text>
//                 )
//             default:
//                 return null;    
//         }
//     }

//     render(){
//         return (
//             <View style={styles.container} >
//                 <Button title="CHECK" onPress={() => console.log(dataProv)} />
//                 <RecyclerListView 
//                     layoutProvider={this.layoutProvider}
//                     dataProvider={this.state.data}
//                     rowRenderer={this.rowRenderer}
//                     renderFooter={!this.state.data ? () => <Text>no data</Text> : () => null}
//                 />
//             </View>
//         )
//     }

// }

const makeGoodData = () => {
    let realResults = results.map((item) => {
        return {name: item.name, type: "ITEM_SPAN_2", id: item.id, vicinity: item.vicinity, rating: item.rating, icon: item.icon, geometry: item.geometry}
    })
    return realResults
}

const NearbyScreen = ({currentLoc}) => {

    let dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });;

    useEffect(() => {
        setDataProv(dataProvider.cloneWithRows(makeGoodData()))
        // return (() => delRawData())
    }, [])

    const distanceBetween = (lat, long) => {
        console.log("LATLONG", typeof lat,typeof long)
        let finalDis = computeDistanceBetween({lat: currentLoc.coords.latitude, lng: currentLoc.coords.longitude}, {lat, long})
        return Math.round(finalDis)
    }

    const [dataProv, setDataProv] = useState(dataProvider.cloneWithRows([]))

    let layoutProvider = new LayoutProvider(dataProv)

    let rowRenderer = (type, data) => {


        let {name, rating, vicinity, icon, geometry} = data
        console.log(geometry)
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

    // const onHideUnderlay = () => {
    //     if (isMounted) setPressStatus(false)
    // }

    // const onShowUnderlay = () => {
    //     if (isMounted) setPressStatus(true)
    // }



  return (
    <View style={styles.container} >
        <ScrollView horizontal={true}>
            <Text style={[styles.options, styles.hospitals]}>Hospitals</Text>
            <Text style={[styles.options, styles.hotels]}>Attractions</Text>
            <Text style={[styles.options, styles.attractions]}>Hotels</Text>
            <Text style={[styles.options, styles.places]}>Places</Text>
        </ScrollView>
            <RecyclerListView 
            style={{backgroundColor: 'black'}}
                layoutProvider={layoutProvider}
                dataProvider={dataProv}
                rowRenderer={rowRenderer}
                renderFooter={!dataProv ? () => <Text>LOADING</Text> : () => null}
            />

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
          elevation: 10
      },
      hospitals:{
        backgroundColor: '#fc4445',
      },
      hotels:{
        backgroundColor: '#66fcf1',
      },
      attractions:{
        backgroundColor: '#fc4c72',
      },
      places:{
        backgroundColor: '#8860d0',
      }
  });


const mapStateToProps = (state) => {
    return {
        currentLoc: state.mapReducer,
    }
}
export default connect(mapStateToProps)(NearbyScreen);  
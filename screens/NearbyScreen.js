import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button, Dimensions, TouchableHighlight, Image  } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";

import { delRawData, setRawData} from '../redux/actions'
import {connect} from 'react-redux';


const { width } = Dimensions.get('window')

// class NearbyScreen extends React.Component {

//     constructor(props){
//         super(props);

//         console.log("CONSTRUCTOR")

//         props.setRawData()

//         let dataProvider = new DataProvider((r1, r2) => {
//             return r1 !== r2;
//         });

//         this.layoutProvider = new LayoutProvider(
//             (i) => {
//                 console.log(this.state.dataProvider.getDataForIndex(i).name)
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

//         this.state = {
//             dataProvider : dataProvider.cloneWithRows(props.rawData)
//         }

//     }

//     componentDidMount(){
//         console.log("MOUNTED IN NEARBY")
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
//                     dataProvider={this.state.dataProvider}
//                     rowRenderer={this.rowRenderer}
//                 />
//             </View>
//         )
//     }

// }


const NearbyScreen = ({rawData, delRawData, setRawData}) => {

    let layoutProvider = new LayoutProvider(
        () => {
            return "NORMAL"
        }, (type, dim) => {
            switch (type){
                case "NORMAL":
                    dim.width = width;
                    dim.height = 160;
                    break;
                default:
                    dim.width = 0;
                    dim.height = 0;    

            }
        }
    );

    let dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });;

    useEffect(() => {
        setRawData()
        
        return (() => delRawData())
    }, [])

    const [dataProv, setDataProv] = useState(dataProvider.cloneWithRows(rawData))

    let rowRenderer = (type, data) => {
        console.log("ROW RENDER", data.name)

        const {name, rating, vicinity} = data
        switch(type){
            case "NORMAL":
                return(
                    <View style={styles.cellContainer}>
                        <Text>{name}</Text>
                        <Text>{rating}</Text>
                        <Text>{vicinity}</Text>
                    </View>
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
        <RecyclerListView 
            layoutProvider={layoutProvider}
            dataProvider={dataProv}
            rowRenderer={rowRenderer}
        />
        {/* <TouchableHighlight 
            style={!pressStatus ? styles.mapButton : styles.pressButton} 
            onPress={openMapScreen}
            onHideUnderlay={onHideUnderlay}
            onShowUnderlay={onShowUnderlay}
        > */}
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
        backgroundColor: '#fff',
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
      cellContainer:{
          marginTop: 20,
          flex: 1,
      }
  });


const mapStateToProps = (state) => {
    return {
        rawData: state.rawData,
        // finalData: state.dataProviderReducer
    }
}
export default connect(mapStateToProps, { setRawData, delRawData})(NearbyScreen);  
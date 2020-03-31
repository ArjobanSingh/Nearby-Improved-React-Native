// const API_KEY = ``;
import Polyline from '@mapbox/polyline';
export const CONF_API_KEY = 'API'


// export const searchPlaces = async(lat, long, radius, query) => {
//     try{
//         const url = `https://api.tomtom.com/search/2/poiSearch/${query}.json?lat=${lat}
//                         &lon=${long}&radius=%${radius}&key=${API_KEY}`
//         const response =  await fetch(url)
//         const json = await response.json()
//         return json   
//     }catch(e){
//         return {msg:e.message, customError: true}
//     }


export const searchGooglePlaces = async(lat, long, radius, query) => {
        try{
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&type=${query}&key=${CONF_API_KEY}`
            const response = await fetch(url)
            const json = await response.json()
            return makeGoodData(json.results)
           
        }
        catch(e){
            return {msg:e.message, customError: true}
        }
    }


    const makeGoodData = (results) => {



        let realResults = results.map((item) => {
            return {name: item.name, type: "ITEM_SPAN_2", id: item.id, vicinity: item.vicinity, 
            rating: item.rating, icon: item.icon, geometry: item.geometry, photos: item.photos}
        })
        return realResults
    }

export const searchPredictedPlaces = async(lat, lon, radius, query) => {
    try{
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&location=${lat},${lon}&radius=${radius}&strictbounds&key=${CONF_API_KEY}`
        const response = await fetch(url)
        const json = await response.json()
        if (json.status === "INVALID_REQUEST"){
            return {msg:"INVALID REQUEST", customError: true}
        }
        else if(json.status === "OK"){
            return json.predictions
        }
    }
    catch(e){
        return {msg:e.message, customError: true}
    }
} 

export const getLocationDetails = async(reference) => {
    try{
        const url = `https://maps.googleapis.com/maps/api/place/details/json?reference=${reference}&sensor=true&key=${CONF_API_KEY}`
        const response = await fetch(url)
        const json = await response.json()
        if (json.status === "INVALID_REQUEST"){
            return {msg: "INVALID_REQUEST", customError: true}
        }
        else if(json.status === "OK"){
            return json.result
        }
    }
    catch(e){
        return {msg: e.message, customError: true}
    }
}


export const getDirections = async(startLoc, destinationLoc) => {

    try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${CONF_API_KEY}`)
        let respJson = await resp.json();
        let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })
        // this.setState({coords: coords})
        return [coords, true]
    } catch(error) {
        // alert(error)
        return [error, false]
    }
}


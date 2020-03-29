// const API_KEY = ``;
const CONF_API_KEY = 'API KEY'


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


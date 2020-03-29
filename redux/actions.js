import signInWithGoogleAsync from '../google_signIn'
import {searchGooglePlaces} from '../api'
import {results} from '../RawData'

const LOGIN = "LOGIN"
const LOGOUT = "LOGOUT"
const LOADING = "LOADING"
const LOGIN_ERROR = "LOGIN_ERROR"
const ADD_LOCATION = "ADD_LOCATION"
const REMOVE_LOCATION = "REMOVE_LOCATION"
const SEARCH_ERROR = "SEARCH_ERROR"
const LOADING_DATA = "LOADING_DATA"
const CANCEL_LOADING_DATA = "CANCEL_LOADING_DATA"
const SET_SEARCH_DATA = "SET_SEARCH_DATA"
const LOCATION_ERROR ="LOCATION_ERROR"
const NO_LOCATION_ERROR = "NO_LOCATION_ERROR"

// export const SET_HOSPITALS_RAW_DATA = "SET_HOSPITALS_RAW_DATA"
// export const SET_ATTRACTIONS_RAW_DATA = "SET_ATTRACTIONS_RAW_DATA"
// export const SET_HOTELS_RAW_DATA = "SET_HOTELS_RAW_DATA"
// export const SET_PLACES_RAW_DATA = "SET_PLACES_RAW_DATA"
// export const DELETE_RAW_DATA = "DELETE_RAW_DATA"
// // export const DATA_PROVIDER = "DATA_PROVIDER"


// const makeGoodData = () => {
//     let realResults = results.map((item) => {
//         return {name: item.name, type: "NORMAL", id: item.id, vicinity: item.vicinity, rating: item.rating}
//     })
//     return realResults
// }

// export const provideData = (data_provider) => {
//     return {
//         type: DATA_PROVIDER,
//         payload : {
//             data_provider
//         }
//     }
// }

// export const setHospitalsRawData = (hospitals_raw_data) =>{

//     return {
//         type: SET_HOSPITALS_RAW_DATA,
//         payload:{
//             hospitals_raw_data
//         }
//     }
// }


// export const setAttractionsRawData = (attractions_raw_data) =>{

//     return {
//         type: SET_ATTRACTIONS_RAW_DATA,
//         payload:{
//             attractions_raw_data
//         }
//     }
// }


// export const setHotelsRawData = (hotels_raw_data) =>{

//     return {
//         type: SET_HOTELS_RAW_DATA,
//         payload:{
//             hotels_raw_data
//         }
//     }
// }


// export const setPlacesRawData = (places_raw_data) =>{

//     return {
//         type: SET_PLACES_RAW_DATA,
//         payload:{
//             places_raw_data
//         }
//     }
// }

// export const delRawData = () => {
//     return {
//         type: DELETE_RAW_DATA
//     }
// }

const noLocationError = () => {
    return {
        type: NO_LOCATION_ERROR
    }
}

const locationError = (err) => {
    return {
        type: LOCATION_ERROR,
        payload : {
            locationErr: err
        }
    }
}

const searchData = (lat, long, radius, query) => {
    return (async(dispatch) => {
        dispatch(loadingData())

        const jsonResponse = await searchGooglePlaces(lat, long, radius, query)
        
        if (!jsonResponse.customError){
            console.log("GOOGLE JSON", jsonResponse)
            dispatch(setSearchData(jsonResponse))
            dispatch(cancelLoadingData())
            return
        }
        dispatch(searchError(jsonResponse.msg))
        dispatch(cancelLoadingData())
    })
}

const searchError = (error) => {
    return {
        type: SEARCH_ERROR,
        payload: {
            error
        }
    }
}

const setSearchData = (searchData) => {
    return {
        type: SET_SEARCH_DATA,
        payload: {
            searchData
        }
    }
}


const cancelLoadingData = () => {
    return {
        type: CANCEL_LOADING_DATA
    }
}

const loadingData = () => {
    return {
        type: LOADING_DATA
    }
}

const addLocation = (location) => {
    return {
        type: ADD_LOCATION,
        payload: {location}
    }
}

const removeLocation = () => {
    return {
        type: REMOVE_LOCATION
    }
}

const handleLogin = () => {
    return (async(dispatch) => {
        dispatch(loading())

        const result = await signInWithGoogleAsync();
        if (result.token) dispatch(login(result.token));
        else if (result.cancelled || result.error) dispatch(loginError(result.err_data))


    })
}

const loading = () =>{
    return {
        type: LOADING
    }
}

const login = (token) => {
    return {
        type : LOGIN,
        payload : {token}
    }
}

const logout = () => {
    return {
        type : LOGOUT
    }
}

const loginError = (err) => {
    return {
        type: LOGIN_ERROR,
        payload : {err}
    }
}

export { LOGIN, LOGOUT, LOADING,LOGIN_ERROR, ADD_LOCATION, REMOVE_LOCATION ,SEARCH_ERROR, 
    LOADING_DATA,CANCEL_LOADING_DATA, SET_SEARCH_DATA, LOCATION_ERROR, NO_LOCATION_ERROR, 
    handleLogin,loading, logout, removeLocation,addLocation, searchData, locationError, noLocationError}
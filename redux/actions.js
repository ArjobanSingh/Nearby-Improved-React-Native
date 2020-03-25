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
// export const SET_RAW_DATA = "SET_RAW_DATA"
// export const DELETE_RAW_DATA = "DELETE_RAW_DATA"
// export const DATA_PROVIDER = "DATA_PROVIDER"


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

// export const setRawData = () =>{

//     return {
//         type: SET_RAW_DATA,
//         payload:{
//             results
//         }
//     }
// }

// export const delRawData = () => {
//     return {
//         type: DELETE_RAW_DATA
//     }
// }

const searchData = (lat, long, radius, query) => {
    return (async(dispatch) => {
        dispatch(loadingData())

        const jsonResponse = await searchGooglePlaces(lat, long, radius, query)
        console.log("GOOGLE JSON",jsonResponse)
        if (!jsonResponse.customError){
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

export { LOGIN, LOGOUT, LOADING,LOGIN_ERROR, ADD_LOCATION, REMOVE_LOCATION ,SEARCH_ERROR, LOADING_DATA,CANCEL_LOADING_DATA, SET_SEARCH_DATA,
    handleLogin,loading, logout, removeLocation, addLocation, searchData}
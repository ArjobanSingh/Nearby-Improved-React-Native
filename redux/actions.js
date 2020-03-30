import signInWithGoogleAsync from '../google_signIn'
import {searchGooglePlaces, searchPredictedPlaces} from '../api'
import {results} from '../RawData'

const LOGIN = "LOGIN"
const LOGOUT = "LOGOUT"
const LOADING = "LOADING"
const LOGIN_ERROR = "LOGIN_ERROR"
const ADD_LOCATION = "ADD_LOCATION"
const REMOVE_LOCATION = "REMOVE_LOCATION"
const LOCATION_ERROR ="LOCATION_ERROR"
const NO_LOCATION_ERROR = "NO_LOCATION_ERROR"


const PREDICTED_ERROR = "PREDICTED_ERROR"
const SET_PREDICTED_DATA = "SET_PREDICTED_DATA"



const setPredicteddata = (data) => {
    return {
        type: SET_PREDICTED_DATA, 
        payload: {data}
    }
}

const predictedError = (err) => {
    return {
        type: PREDICTED_ERROR,
        payload: {err}
    }
}


const searchPrdicted = (lat, lon, radius, query) => {
    return (async(dispatch) => {
        const resp = await searchPredictedPlaces(lat, lon, radius, query)
        if (!resp.customError){
            dispatch(setPredicteddata(resp))
            return
        }
        dispatch(predictedError(resp.msg))
    })
}


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

export { LOGIN, LOGOUT, LOADING,LOGIN_ERROR, ADD_LOCATION, REMOVE_LOCATION ,LOCATION_ERROR, NO_LOCATION_ERROR,  
    PREDICTED_ERROR, SET_PREDICTED_DATA,
    handleLogin,loading, logout, removeLocation,addLocation, locationError, 
    noLocationError, setPredicteddata, predictedError, searchPrdicted}
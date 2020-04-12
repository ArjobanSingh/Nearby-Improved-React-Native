
import { searchPredictedPlaces} from '../api'


const ADD_LOCATION = "ADD_LOCATION"
const REMOVE_LOCATION = "REMOVE_LOCATION"

const LOCATION_ERROR ="LOCATION_ERROR"
const NO_LOCATION_ERROR = "NO_LOCATION_ERROR"

const PREDICTED_ERROR = "PREDICTED_ERROR"
const SET_PREDICTED_DATA = "SET_PREDICTED_DATA"
const REMOVE_PREDICTED_DATA = "REMOVE_PREDICTED_DATA"

const removePredictedData = () => ({type: REMOVE_PREDICTED_DATA})

// const SET_LOCATION_DETAILS = 'SET_LOCATION_DETAILS'
// const LOCATION_DETAIL_ERROR = 'LOCATION_DETAIL_ERROR'
// const DELETE_LOCATION_DETAILS = 'DELETE_LOCATION_DETAILS'
// const LOADING_DETAIL_DATA = 'LOADING_DETAIL_DATA'
// const COMPLETED_LOADING = 'COMPLETED_LOADING'

// const loadingDetailData = () => ({type: LOADING_DETAIL_DATA})
// const completedLoading = () => ({type: COMPLETED_LOADING})

// const deleteLocationDetails = () => {
//     return {
//         type: DELETE_LOCATION_DETAILS
//     }
// }

// const getLocationDetailsAsync = (reference) => {
//     return (async(dispatch) => {
//         dispatch(loadingDetailData())
//         const resp = await getLocationDetails(reference)
//         if (!resp.customError){
//             dispatch(setLocationDetailData(resp))
//             dispatch(completedLoading())
//             return
//         }
//         dispatch(locationDetailError(resp.msg))
//         dispatch(completedLoading())
//     })
// }

// const setLocationDetailData = (data) => {
//     return {
//         type: SET_LOCATION_DETAILS,
//         payload : {data}
//     }
// }

// const locationDetailError = (err) => {
//     return {
//         type: LOCATION_DETAIL_ERROR,
//         payload : {err}
//     }
// }

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
        if (resp.customError === undefined){
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


export { ADD_LOCATION, REMOVE_LOCATION ,LOCATION_ERROR, NO_LOCATION_ERROR,  
    PREDICTED_ERROR, SET_PREDICTED_DATA, REMOVE_PREDICTED_DATA,
     removeLocation,addLocation, locationError,
    noLocationError, setPredicteddata, predictedError, searchPrdicted, removePredictedData}
import { REMOVE_LOCATION, ADD_LOCATION,LOCATION_ERROR,
    NO_LOCATION_ERROR, PREDICTED_ERROR, SET_PREDICTED_DATA, REMOVE_PREDICTED_DATA } from './actions'
import { combineReducers } from 'redux'


// const singleLocationDetail = (state={detail : {}, error: false, errMsg: '', loading: false}, action) => {
    
//     switch(action.type){
//         case LOADING_DETAIL_DATA:
//             return {...state, loading: true}
//         case COMPLETED_LOADING:
//             return {...state, loading: false}    
//         case SET_LOCATION_DETAILS:
//             return {detail : action.payload.data, error: false, errMsg: ''}
//         case LOCATION_DETAIL_ERROR:
//             return {detail : {}, error: true, errMsg: action.payload.err}
//         case DELETE_LOCATION_DETAILS:
//             return {detail : {}, error: false, errMsg: ''}    
//         default:
//             return state        
//     }
// }


const locationErr = (state={error: false, errMsg: ""},action ) => {
    switch(action.type){
        case LOCATION_ERROR:
            return {error: true, errMsg: action.payload.locationErr}
        case NO_LOCATION_ERROR:
            return {error: false, errMsg: ""}
        default:
            return state    
    }
}


// const isLoginReducer = (state = {isLoggedIn: false, error:'', token:'', loadingLogin: false}, action) => {
//     switch (action.type){
//         case LOADING:
//             return {...state, loadingLogin: true }
//         case LOGIN:
//             return {isLoggedIn:true, token: action.payload.token, loadingLogin:false, error:''}
//         case LOGOUT:
//             return {isLoggedIn:false, token:'', loadingLogin:false, error:''}
//         case LOGIN_ERROR:
//             return {isLoggedIn:false, token:'', error: action.payload.err_data, loadingLogin:false}
//         default:
//             return state    
//     }
// }

const mapReducer = (state = null, action) => {
    switch(action.type){
        case ADD_LOCATION:
            return action.payload.location
        case REMOVE_LOCATION:
            return null
        default:
            return state        
    }
}

const predictedDataState = (state={ error:false, errMsg:"", data:[]}, action) => {
    switch(action.type){
        case SET_PREDICTED_DATA:
            return {error : false, errMsg:"", data:action.payload.data}
        case PREDICTED_ERROR:
            return {error : true, errMsg:action.payload.err, data:[]}
        case REMOVE_PREDICTED_DATA:
            return {error: false, errMsg: '', data:[]}    
        default:
            return state        
    }
}

export default combineReducers({
    mapReducer,
    locationErr,
    predictedDataState,
  })




import {LOGIN, LOGOUT, LOGIN_ERROR, LOADING, REMOVE_LOCATION, ADD_LOCATION,
    SEARCH_ERROR, LOADING_DATA,CANCEL_LOADING_DATA, SET_SEARCH_DATA,SET_RAW_DATA, DELETE_RAW_DATA } from './actions'
import { combineReducers } from 'redux'


// export const dataProviderReducer = (state=null, action) => {
//     switch(action.type){
//         case DATA_PROVIDER:
//             return action.payload.data_provider
//         default:
//             return state    
//     }
// }

// const rawData = (state=[], action) => {
//     switch(action.type){
//         case SET_RAW_DATA:
//             return action.payload.results
//         case DELETE_RAW_DATA:
//             return []
//         default:
//             return state        
//     }
// }

const searchData = (state={loadingData : false, data :null, dataError : null}, action) => {
    switch(action.type){
        case LOADING_DATA:
            return {...state, loadingData: true}
        case CANCEL_LOADING_DATA:
            return {...state, loadingData: false}
        case SEARCH_ERROR:
            return {...state, data:null, dataError:action.payload.error} 
        case SET_SEARCH_DATA:
            return {...state, dataError:null, data:action.payload.searchData}        
        default:
            return state       
    }
}

const isLoginReducer = (state = {isLoggedIn: false, error:'', token:'', loadingLogin: false}, action) => {
    switch (action.type){
        case LOADING:
            return {...state, loadingLogin: true }
        case LOGIN:
            return {isLoggedIn:true, token: action.payload.token, loadingLogin:false, error:''}
        case LOGOUT:
            return {isLoggedIn:false, token:'', loadingLogin:false, error:''}
        case LOGIN_ERROR:
            return {isLoggedIn:false, token:'', error: action.payload.err_data, loadingLogin:false}
        default:
            return state    
    }
}

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

export default combineReducers({
    isLoginReducer,
    mapReducer,
    searchData,
  })




import {LOGIN, LOGOUT, LOGIN_ERROR, LOADING, REMOVE_LOCATION, ADD_LOCATION } from './actions'
import { combineReducers } from 'redux'

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

const mapReducer = (state = {location: null}, action) => {
    switch(action.type){
        case ADD_LOCATION:
            return action.payload.location
        case REMOVE_LOCATION:
            return null
        default:
            return null        
    }
}

export default combineReducers({
    isLoginReducer,
    mapReducer
  })




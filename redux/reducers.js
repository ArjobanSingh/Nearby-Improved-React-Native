import {LOGIN, LOGOUT, LOGIN_ERROR, LOADING } from './actions'

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

export default isLoginReducer
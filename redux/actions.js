import signInWithGoogleAsync from '../google_signIn'

const LOGIN = "LOGIN"
const LOGOUT = "LOGOUT"
const LOADING = "LOADING"
const LOGIN_ERROR = "LOGIN_ERROR"

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

export { LOGIN, LOGOUT, LOADING,LOGIN_ERROR ,handleLogin,loading, logout}
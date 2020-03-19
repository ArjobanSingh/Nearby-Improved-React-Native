import { createStore, applyMiddleware  } from 'redux'

import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk';
import { AsyncStorage } from 'react-native';

import isLoginReducer from './reducers'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  }


const persistedReducer = persistReducer(persistConfig, isLoginReducer)

let store = createStore(persistedReducer, applyMiddleware(thunk))
let persistor = persistStore(store)

export  {store, persistor}
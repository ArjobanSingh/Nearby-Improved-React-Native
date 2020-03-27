import { createStore, applyMiddleware  } from 'redux'

import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk';
import { AsyncStorage } from 'react-native';

import rootReducer from './reducers'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  }


const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(persistedReducer, applyMiddleware(thunk))
let persistor = persistStore(store)
// let store = createStore(rootReducer, applyMiddleware(thunk))
export  {store, persistor}
import 'react-native-gesture-handler';
import React from 'react';

// In app imports
import MainApp from './components/MainApp'
import { PersistGate } from 'redux-persist/integration/react'

//third party imports
import {store, persistor} from './redux/store'
import { Provider } from 'react-redux'

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainApp />
      </PersistGate>
    </Provider>
  );
}

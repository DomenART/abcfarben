import { applyMiddleware, createStore, compose } from 'redux'
import logger from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import RootReducer from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

const persistConfig = {
    key: 'web',
    storage,
}

const persistedReducer = persistReducer(persistConfig, RootReducer)

const store = createStore(
    persistedReducer, composeWithDevTools(
        applyMiddleware(ReduxThunk, logger)
    )
)

const persistor = persistStore(store)

export { store, persistor }
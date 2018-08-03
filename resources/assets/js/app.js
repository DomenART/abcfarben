import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import Routes from './routes'
import * as action from './store/actions/auth'
import SvgSprite from './components/UI/SvgSprite'

window.UIkit = require('uikit')
UIkit.use(require('uikit/dist/js/uikit-icons'))

store.dispatch(action.authCheck())

render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Routes />
            <SvgSprite />
        </PersistGate>
    </Provider>,
    document.getElementById('app')
)
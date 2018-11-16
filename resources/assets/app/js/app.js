import React from 'react'
import { render } from 'react-dom'
import Routes from './routes'
import SvgSprite from './components/UI/SvgSprite'

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { cache, link, persistor } from './apollo'

persistor.restore().then(() => {
  const client = new ApolloClient({
    cache,
    link
  })

  render(
    <ApolloProvider client={client}>
      <Routes />
      <SvgSprite />
    </ApolloProvider>,
    document.getElementById('app')
  )
})

window.UIkit = require('uikit')
UIkit.use(require('uikit/dist/js/uikit-icons'))
// require('jspolyfill-array.prototype.findIndex')
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'
import { CachePersistor } from 'apollo-cache-persist'
import { createUploadLink } from 'apollo-upload-client'

export const cache = new InMemoryCache()

const stateLink = withClientState({ cache })

// const httpLink = createHttpLink({
const httpLink = createUploadLink({
  uri: '/graphql'
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    }
  }
})

export const link = ApolloLink.from([stateLink, authLink.concat(httpLink)])

export const persistor = new CachePersistor({
  cache,
  storage: localStorage,
  debug: true
})
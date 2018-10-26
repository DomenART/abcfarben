import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'
import { resolvers, defaults, typeDefs } from './resolvers'
import { CachePersistor } from 'apollo-cache-persist'
import { createUploadLink } from 'apollo-upload-client'

export const cache = new InMemoryCache()

const stateLink = withClientState({
  cache,
  resolvers,
  defaults,
  typeDefs
})

// const httpLink = createHttpLink({
const httpLink = createUploadLink({
  uri: 'http://localhost:8080/graphql'
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

export const link = ApolloLink.from([stateLink, authLink.concat(httpLink)])

export const persistor = new CachePersistor({
  cache,
  storage: localStorage,
  debug: true
})

export const typeDefs = `
  type Query {
    isAuthenticated: Boolean
    token: String
  }
  type Mutation {
    assignAuthToken(token: String): Int
    checkAuth(unused: String): Int
  }
`

export const defaults = {
  isAuthenticated: false,
  token: '',
}

export const resolvers = {
  Mutation: {
    assignAuthToken: (_, { token }, { cache }) => {
      localStorage.setItem('token', token)
      const data = {
        isAuthenticated: !!token,
        token
      }
      cache.writeData({ data })
    },

    checkAuth: (_, params, { cache }) => {
      const token = localStorage.getItem('token')
      const data = {
        isAuthenticated: !!token,
        token
      }
      cache.writeData({ data })
    }
  }
}
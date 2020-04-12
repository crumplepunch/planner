import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import debug from 'debug'
const log = debug('Projects:apollo:log')

const cache = new InMemoryCache()
const link = new HttpLink({ uri: 'http://mbp.local:4000' })
log('setup')
export const client = new ApolloClient({
  cache,
  link
})
export * from './queries'
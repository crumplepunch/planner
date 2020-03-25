import { ApolloClient } from 'apollo-client'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { GET_PROJECTS } from './queries'
import debug from 'debug'
const log = debug('Projects:apollo:log')

const cache = new InMemoryCache()
const link = new HttpLink({ uri: 'http://mbp.local:4000' })

export const client = new ApolloClient({
  cache,
  link
})

export async function GetProjects() {
  return client.query({
    query: GET_PROJECTS
  }).then(result => log(result))
}
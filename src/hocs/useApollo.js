import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'

export const useApollo = (client, Component) => props => <ApolloProvider client={client}><Component {...props}></Component></ApolloProvider>
import gql from 'graphql-tag'
export const GET_PROJECTS = gql`
query {
  projects {
    _id
    name
    description
    design{
      lead
    }
    development {
      lead
      stack
      completions {
        message
      }
    }
  }
}
`
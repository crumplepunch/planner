import gql from 'graphql-tag'
export const GET_PROJECTS = gql`
query {
  projects {
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
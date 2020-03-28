import gql from 'graphql-tag'
export const GET_PROJECTS = gql`
query ($sortField: String, $direction: Int) {
  projects(sortField: $sortField, direction: $direction) {
    _id
    name
    description 
    plans {
      research {
        tasks
      }
      build {
        tasks
      }
    }
  }
}
`
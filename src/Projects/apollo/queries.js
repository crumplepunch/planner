import gql from 'graphql-tag'
export const GET_PROJECTS = gql`
query ($sortField: String, $direction: Int) {
  projects(sortField: $sortField, direction: $direction) {
    _id
    name
    description 
    logs {
      project
      markdown
      date
      name
    }
  }
}
`
export const ADD_PROJECT = gql`
  mutation AddTodo($name: String!, $description: String) {
    addTodo(
      name: $name,
      description: $description
    ) {
      _id
      name
    }
  }
`
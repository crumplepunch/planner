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
  mutation ($name: String!, $description: String) {
    addProject(
      name: $name,
      description: $description
    ) {
      _id
      name
    }
  }
`

export const GET_PROJECT = gql`
query ($name: String, $id: ID) {
  project(name: $name, id: $id) {
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
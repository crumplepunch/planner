import { createContext } from 'react'

export const KeyBindingsContext = createContext({
  currentBindings: {},
  disable: () => { },
  enable: () => { },
})

export const ListContext = createContext({
  items: [],
  currentItem: null
})

export const ProjectContext = createContext({
  project: {
    title: '',
    description: '',
    deadline: '',
    tasks: [],
    logs: []
  }
})
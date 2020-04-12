import { createContext } from 'react'
export const ListContext = createContext({
  items: [],
  currentItem: null
})
export const KeyBindingsContext = createContext({
  currentBindings: {},
  disable: () => { },
  enable: () => { },
})
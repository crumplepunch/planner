import { useReducer, useCallback } from 'react'
import { ListContext } from '../contexts'

const reducer = (acc, { type, items, item, mode }) => {
  if (type === 'load') {
    items.forEach((item, i) => {
      item.prev = i ? items[i - 1] : items[items.length - 1]
      item.next = items[(i + 1) % items.length]
    })

    return Object.assign({}, acc, {
      items: items || [],
      currentItem: items[0] || null,
      mode: 'list'
    })
  }
  if (type === 'select') return Object.assign({}, acc, { currentItem: item })
  if (type === 'next') return Object.assign({}, acc, { currentItem: acc.currentItem.next })
  if (type === 'prev') return Object.assign({}, acc, { currentItem: acc.currentItem.prev })
  if (type === 'mode') return Object.assign({}, acc, { mode })

  console.log(`Unknown dispatch: ${type}`)
  return
}
const defaultVal = {
  items: [],
  currentItem: null
}
export const useListContext = (items = []) => {
  if (items) { }
  const [listState, dispatch] = useReducer(reducer, defaultVal)

  const add = useCallback(() => dispatch({ type: 'mode', mode: 'add' }), [dispatch])
  const prev = useCallback(() => dispatch({ type: 'prev' }), [dispatch])
  const next = useCallback(() => dispatch({ type: 'next' }), [dispatch])
  const loadList = useCallback(items => dispatch({ type: 'load', items }), [dispatch])
  const select = useCallback(item => dispatch({ type: 'select', item }), [dispatch])
  const view = useCallback(() => dispatch({ type: 'mode', mode: 'list' }), [dispatch])

  return [ListContext, listState, {
    loadList, select, prev, next, add, view
  }]
}
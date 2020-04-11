import React, { useState, useEffect, useRef, useContext, useReducer } from 'react'
import { useKeyBindings } from '../hooks'
import { Scroll } from '../components'

export const ListContext = React.createContext({
  listItems: [],
  currentItem: null
})

const ListActionReducerArgs = [(acc, { type, listItems, item, mode }) => {
  if (type === 'load') {
    listItems.forEach((item, i) => {
      item.prev = i ? listItems[i - 1] : listItems[listItems.length - 1]
      item.next = listItems[(i + 1) % listItems.length]
    })

    return Object.assign({}, acc, {
      listItems: listItems || [],
      currentItem: listItems[0] || null,
      mode: 'list'
    })
  }
  if (type === 'select') return Object.assign({}, acc, { currentItem: item })
  if (type === 'next') return Object.assign({}, acc, { currentItem: acc.currentItem.next })
  if (type === 'prev') return Object.assign({}, acc, { currentItem: acc.currentItem.prev })
  if (type === 'mode') return Object.assign({}, acc, { mode })

}, {
  listItems: [],
  currentItem: null
}]

export const useListContext = () => {
  const [listState, listDispatch] = useReducer(...ListActionReducerArgs)
  return [ListContext, Object.assign(listState, {
    loadList: listItems => listDispatch({ type: 'load', listItems }),
    select: item => listDispatch({ type: 'select', item }),
    prev: () => listDispatch({ type: 'prev' }),
    next: () => listDispatch({ type: 'next' }),
    add: () => listDispatch({ type: 'mode', mode: 'add' }),
    view: () => listDispatch({ type: 'mode', mode: 'list' }),
    enter: () => { }
  })]
}

export function useList(Component) {
  return function List(props) {
    const {
      listItems: items,
      currentItem,
      next,
      prev,
      select,
      mode,
      view,
      enter
    } = useContext(ListContext)

    const { AddListItem } = props
    const [modifiers, setModifiers] = useState({})
    const listRef = useRef()

    const [freeListKeys, registerListKeys] = useKeyBindings({
      j: {
        down: next
      },
      k: {
        down: prev
      },
      Enter: {
        down: () => document.getElementById(currentItem._id).classList.add('active'),
        up: () => {
          document.getElementById(currentItem._id).classList.remove('active')
          enter()
        }
      },
      Control: {
        down: () => setModifiers(Object.assign(modifiers, { ctrl: true })),
        up: () => setModifiers(Object.assign(modifiers, { ctrl: false }))
      }
    }, listRef.current)

    useKeyBindings({
      Escape: {
        down: () => {
          view()
          listRef.current && listRef.current.focus()
        }
      }
    }, window)

    useEffect(() => {
      listRef.current && listRef.current.focus()
    }, [])

    return <Scroll >
      <div className='flex-column max-flex-room container scroll' ref={listRef} tabIndex='0'>
        {mode === 'list' && items.map((item, i) => <Component
          key={item._id} {...item}
          isFocused={item === currentItem}
          isHovered={item === currentItem}
          mouseOptions={{
            onClick: e => {
              select(item)
            },
            onContextMenu: e => {
              e.preventDefault()
            }
          }} />)}
      </div>
      {mode === 'add' && AddListItem && <AddListItem disableKeyBindings={[{ free: freeListKeys, register: registerListKeys }]} />}
    </Scroll>
  }
} 
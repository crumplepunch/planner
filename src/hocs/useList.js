import React, { useState, useEffect, useRef, useContext } from 'react'
import { useKeyBindings } from '../hooks'
import { ListContext } from '../contexts'
import { Scroll } from '../components'


export function useList(Component) {
  return function List(props) {
    const {
      items,
      currentItem,
      next,
      prev,
      select,
      mode,
      view
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
          // enter()
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
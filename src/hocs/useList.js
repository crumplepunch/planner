import React, { useState, useEffect, useRef, useContext } from 'react'
import { useKeyBindings } from '../hooks'
import { ListContext } from '../contexts'
import { Scroll } from '../components'


export function useList(Component) {
  return function List(props) {

    const {
      listState: {
        items,
        currentItem
      },
      ops: {
        next,
        prev,
        select,
        view,
        enter = () => { }
      }
    } = useContext(ListContext)

    const [modifiers, setModifiers] = useState({})
    const listRef = useRef()

    const [freeNav, registerNav] = useKeyBindings({
      Enter: {
        down: () => document.getElementById(currentItem._id).classList.add('active'),
        up: () => {
          document.getElementById(currentItem._id).classList.remove('active')
          freeNav()
          enter()
        }
      },
      j: {
        down: next
      },
      k: {
        down: prev
      }
    }, listRef.current)

    useKeyBindings({
      Control: {
        down: () => setModifiers(Object.assign(modifiers, { ctrl: true })),
        up: () => setModifiers(Object.assign(modifiers, { ctrl: false }))
      }
    }, listRef.current)

    useKeyBindings({
      Escape: {
        down: () => {
          view()
          registerNav()
          listRef.current && listRef.current.focus()
        }
      }
    }, window)

    useEffect(() => {
      listRef.current && listRef.current.focus()
    }, [])

    return <Scroll >
      <div className='flex-column max-flex-room container scroll' ref={listRef} tabIndex='0'>
        {items.map((item, i) => <Component
          key={item._id} {...item}
          ordered={i}
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
    </Scroll>
  }
} 
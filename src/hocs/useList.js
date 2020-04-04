import React, { useState, useEffect, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useKeyBindings, registerKeyBindings, freeKeyBindings } from '../hooks/useKeyBindings'


export function useList(Component) {
  return function List(props) {
    const { pointerState, items, path, nextRef } = props
    const [currentItem, setCurrentItem] = pointerState
    const [modifiers, setModifiers] = useState({})
    const listRef = useRef()
    const history = useHistory()
    const params = useParams()

    listRef.current && listRef.current.focus()

    const setListItem = (item, push = true) => {
      setCurrentItem(item)
      push && history.push(`/${path}/${item.name.toLowerCase().replace(/ /g, '-')}`)
      document.title = item.name
    }

    const [listBindings, windowBindings] = [useKeyBindings({
      j: {
        down: () => {
          const item = items[(items.indexOf(currentItem) + 1) % items.length]
          setListItem(item)
        }
      },
      k: {
        down: () => setListItem(items[(items.indexOf(currentItem) || items.length) - 1]),
      },
      Enter: {
        down: () => document.getElementById(currentItem._id).classList.add('active'),
        up: () => {
          document.getElementById(currentItem._id).classList.remove('active')
          nextRef.current && nextRef.current.focus()
        }
      },
      Control: {
        down: () => setModifiers(Object.assign(modifiers, { ctrl: true })),
        up: () => setModifiers(Object.assign(modifiers, { ctrl: false }))
      }
    }), useKeyBindings({
      Escape: {
        down: () => listRef.current.focus()
      }
    })]

    useEffect(() => {
      const { current } = listRef

      current && registerKeyBindings(listRef.current)(listBindings)
      window && registerKeyBindings(window)(windowBindings)

      return () => {
        freeKeyBindings(current)(listBindings)
        freeKeyBindings(window)(windowBindings)
      }
    }, [items, listRef, currentItem, nextRef, listBindings, windowBindings])

    useEffect(() => {
      !currentItem && setListItem(params.id ? items[items.map(item => item.name.replace(/-/g, '').replace(/ /g, '').toLowerCase()).indexOf(params.id.replace(/-/g, ''))] : items[0], false)
    })


    return <div className='flex-column max-flex-room' ref={listRef} tabIndex='0'>
      {items.map((item, i) => <Component
        key={item._id} {...item}
        isFocused={item === currentItem}
        isHovered={item === currentItem}
        mouseOptions={{
          onClick: e => {
            setListItem(item)
          },
          onContextMenu: e => {
            e.preventDefault()
          }
        }} />)}
    </div>
  }
}
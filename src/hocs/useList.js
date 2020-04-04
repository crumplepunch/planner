import React, { useState, useEffect, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useKeyBindings, registerKeyBindings, freeKeyBindings } from '../hooks/useKeyBindings'


export function useList(Component) {
  return function List(props) {
    const { pointerState, items, path, nextRef, options = {}, AddListItem } = props
    const [currentItem, setCurrentItem] = pointerState
    const [modifiers, setModifiers] = useState({})
    const listRef = useRef()
    const history = useHistory()
    const params = useParams()
    const [mode, setMode] = useState('list')

    const setListItem = (item, push = true) => {
      if (item) {
        setCurrentItem(item)
        push && path && history.push(`/${path}/${item.name.toLowerCase().replace(/ /g, '-')}`)

        document.title = item.name
      }
    }

    const changeMode = (m) => {
      if (m === mode) return
      if (m === 'list') {
        history.push(`/${path}/${(currentItem || items[0]).name.toLowerCase().replace(/ /g, '-')}`)
      }
      // history.push(`/${path}/${m}`)
      document.tile = `${path} - ${m}`
      setMode(m)
    }
    const [listBindings, windowBindings] = [useKeyBindings({
      a: {
        down: () => {
          changeMode('add')
        }
      },
      j: {
        down: () => {
          if (mode === 'list') {
            const item = items[(items.indexOf(currentItem) + 1) % items.length]
            setListItem(item)
          }
        }
      },
      k: {

        down: () => {
          if (mode === 'list') {

            setListItem(items[(items.indexOf(currentItem) || items.length) - 1])
          }
        }
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
        down: () => {
          changeMode('list')
          listRef.current.focus()
        }
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

      const item = params.id ? items[items.map(item => item.name.replace(/-/g, '').replace(/ /g, '').toLowerCase()).indexOf(params.id.replace(/-/g, ''))] : items[0]
      if (!currentItem || currentItem !== item) setListItem(item, false)
    })

    listRef.current && listRef.current.focus()

    return <div className='flex-column max-flex-room' ref={listRef} tabIndex='0'>
      {mode === 'list' && items.map((item, i) => <Component
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
      {mode === 'add' && AddListItem && <AddListItem />}
    </div>
  }
}
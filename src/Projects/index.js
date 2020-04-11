import React, { useState, useRef } from 'react'
import { useListContext } from '../hocs'
import './index.scss'
import ProjectList, { Info } from './ProjectList'

export default () => {
  const pointerState = useState(null)
  const logsRef = useRef()

  const [ListContext, listState] = useListContext()

  return <div className='projects container flex-column flex-grow'>
    <div className='max-flex-room flex-row container'>
      <ListContext.Provider value={listState}>
        <ProjectList pointerState={pointerState} />
      </ListContext.Provider>

      <div className='flex-column container' ref={logsRef} tabIndex='0'>
        {listState.currentItem && <Info project={listState.currentItem} />}
      </div >
    </div>
  </div >
}

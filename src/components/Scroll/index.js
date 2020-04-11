import React from 'react'
import './scroll.scss'

export const Scroll = (props) => <div className='scroll-container' style={{
  overflow: 'hidden'
}} >
  {props.children}
</div>
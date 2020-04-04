import React from 'react'
import { Action } from 'component'

export const ProjectActions = props => {

  return <div className="container">
    <Action label='(T)rack' isFocused={action === 'track'} mouseOptions={{ onMouseEnter: _ => setAction('track'), onMouseLeave: _ => setAction('') }} />
    <Action label='(A)dd' isFocused={action === 'add'} mouseOptions={{ onMouseEnter: _ => setAction('add'), onMouseLeave: _ => setAction('') }} />
    <Action label='(V)iew' isFocused={action === 'view'} mouseOptions={{ onMouseEnter: _ => setAction('view'), onMouseLeave: _ => setAction('') }} />
    <Action label='(E)dit' isFocused={action === 'edit'} mouseOptions={{ onMouseEnter: _ => setAction('edit'), onMouseLeave: _ => setAction('') }} />
  </div>
}

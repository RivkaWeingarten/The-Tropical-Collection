import {Alert} from 'react-bootstrap'
import React from 'react'

function Message({variant, children}) {
  return (
  <Alert variant ={variant}>
    {children}
  </Alert>
  )
}
Message.defaultProps={
    variant: 'info',
};
export default Message
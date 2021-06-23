import React, { useState } from 'react'
import { TextField } from '@material-ui/core'

const PDFCreator = (props) => {
  return (
    <div>
      <input type="file" name="file" onChange={e => props.setPDF(e.target.files[0])} />
    </div>
  )
}

export default PDFCreator


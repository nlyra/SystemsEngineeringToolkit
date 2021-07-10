import React, { useState } from 'react'
import { TextField } from '@material-ui/core'

const FileCreator = (props) => {
  return (
    <div>
      <input type="file" name="file" onChange={e => props.setFile(e.target.files[0])} />
    </div>
  ) 
}

export default FileCreator
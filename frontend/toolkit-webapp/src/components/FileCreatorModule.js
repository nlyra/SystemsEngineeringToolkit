import React, { useState } from 'react'
import { TextField } from '@material-ui/core'

const FileCreator = (props) => {
  const [fileDescription, setFileDescription] = useState('')

  sessionStorage.setItem('fileDescription', fileDescription)
  return (
    <div>
      <TextField
        size='small'
        variant="filled"
        multiline
        rows={3}
        rowsMax={15}
        label='File Description'
        type="body"
        value={fileDescription}
        onChange={e => setFileDescription(e.target.value)}
        margin="normal"
        required={true}
        fullWidth
      />
      <input type="file" name="file" onChange={e => props.setFile(e.target.files[0])} />
    </div>
  ) 
}

export default FileCreator
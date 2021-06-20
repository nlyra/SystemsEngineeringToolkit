import React, { useState } from 'react'
import { TextField } from '@material-ui/core'

const PDFCreator = (props) => {
  const [pdfDescription, setPDFDescription] = useState('')

  sessionStorage.setItem('pdfDescription', pdfDescription)
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
        value={pdfDescription}
        onChange={e => setPDFDescription(e.target.value)}
        margin="normal"
        required={true}
        fullWidth
      />
      <input type="file" name="file" onChange={e => props.setPDF(e.target.files[0])} />
    </div>
  )
}

export default PDFCreator


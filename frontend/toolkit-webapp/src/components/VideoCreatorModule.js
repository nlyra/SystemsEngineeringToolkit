import React, { useState } from 'react'
import { TextField } from '@material-ui/core'

const VideoCreator = (props) => {
  const [videoDescription, setVideoDescription] = useState('')

  sessionStorage.setItem('videoDescription', videoDescription)
  return (
    <div>
      <TextField
        size='small'
        variant="filled"
        multiline
        rows={3}
        rowsMax={15}
        label='Video Description'
        type="body"
        value={videoDescription}
        onChange={e => setVideoDescription(e.target.value)}
        margin="normal"
        required={true}
        fullWidth
      />
      <input type="file" name="video" onChange={e => props.setVideo(e.target.files[0])} />
    </div>
  )
}

export default VideoCreator

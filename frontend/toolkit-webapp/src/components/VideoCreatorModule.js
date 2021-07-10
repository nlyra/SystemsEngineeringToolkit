import React, { useState } from 'react'
import { TextField } from '@material-ui/core'

const VideoCreator = (props) => {
  return (
    <div>
      <input type="file" name="video" onChange={e => props.setVideo(e.target.files[0])} />
    </div>
  )
}

export default VideoCreator

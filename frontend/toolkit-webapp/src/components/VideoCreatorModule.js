import React from 'react'

const VideoCreator = (props) => {
  return (
    <div>
      <input type="file" name="video" onChange={e => props.setVideo(e.target.files[0])} />
    </div>
  )
}

export default VideoCreator

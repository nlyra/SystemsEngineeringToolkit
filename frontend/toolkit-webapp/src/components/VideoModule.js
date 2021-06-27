import React from 'react'
import { makeStyles } from '@material-ui/core'

const videoStyles = makeStyles((theme) => ({
  div: {
    maxWidth: '1280px',
  }
}))


const VideoModule = ({ videoUrl }) => {
  const classes = videoStyles()
  console.log(videoUrl)
  return (
    <div className={classes.div}>
      <video width="100%" controls >
        <source src={videoUrl} />
      </video>
    </div>
  )
}

export default VideoModule

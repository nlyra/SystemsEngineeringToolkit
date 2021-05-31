import React from 'react'
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core'

const dashStyles = makeStyles((theme) => ({
  div: {
    maxWidth: '1280px'
  }
}))


const VideoModule = () => {
  const classes = dashStyles()

  return (
    <div className={classes.div}>
      <video width="100%" controls >
        <source src="http://localhost:4000/video.mp4" />
      </video>
    </div>
  )
}

export default VideoModule

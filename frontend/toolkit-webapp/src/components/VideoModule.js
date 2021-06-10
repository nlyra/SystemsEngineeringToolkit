import React from 'react'
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core'

const videoStyles = makeStyles((theme) => ({
  div: {
    maxWidth: '1280px',
  }
}))


const VideoModule = ({ fileUrl }) => {
  const classes = videoStyles()

  return (
    <div className={classes.div}>
      <video width="100%" controls >
        <source src={fileUrl} />
      </video>
    </div>
  )
}

export default VideoModule

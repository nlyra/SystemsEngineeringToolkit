import React from 'react'
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core'

const dashStyles = makeStyles((theme) => ({

}))


const VideoModule = () => {
  const classes = dashStyles()

  return (
    <>
      <video width="750" height="500" controls >
        <source src="http://localhost:4000/video.mp4" type="video/mp4" />
      </video>
    </>
  )
}

export default VideoModule

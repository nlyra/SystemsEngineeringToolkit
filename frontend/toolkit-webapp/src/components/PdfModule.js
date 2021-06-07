import React from 'react'
import { makeStyles } from '@material-ui/core'

const dashStyles = makeStyles((theme) => ({
}))

const PdfModule = ({ fileUrl }) => {
  const classes = dashStyles()


  return (
    <div className={classes.div}>
      <iframe
        src={fileUrl}
        width="100%"
        height="800px"
        frameBorder="0"
      >
      </iframe>
    </div>
  )
}

export default PdfModule

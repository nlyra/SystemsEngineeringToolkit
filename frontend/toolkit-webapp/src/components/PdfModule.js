import React from 'react'
import { makeStyles } from '@material-ui/core'

const pdfStyles = makeStyles((theme) => ({
}))

const PdfModule = ({ fileUrl }) => {
  const classes = pdfStyles()


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

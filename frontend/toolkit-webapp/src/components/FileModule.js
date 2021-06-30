import React, {useState} from 'react'
import { makeStyles, Button, Box, Typography } from '@material-ui/core'

const fileStyles = makeStyles((theme) => ({
}))


const FileModule = ({ fileUrl }) => {
  const [part, setpart] = useState(fileUrl.split('/'))
  const classes = fileStyles()
  console.log(fileUrl)

  function download(){
    var parts = fileUrl.split('/');
    var name = parts[parts.length-1]

    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob =>{
        var element = document.createElement('a')
        element.style.display='none'
        element.href = URL.createObjectURL(blob)
        element.download = name

        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      })
  }

  return (
    <div className={classes.div}>
      <Box m={2} pt={2}>
        <Typography className={classes.Title} variant="h5">{part[part.length-1]}</Typography>
      </Box>
      <Button type='submit' className={classes.button1} size="small" variant="contained" onClick={download}>
        Download
      </Button>
    </div>
  )
}

export default FileModule

import { makeStyles } from '@material-ui/core'
import React, { useState } from 'react'

// Styling
const useStyles = makeStyles((theme) => ({

    dragDropContainer:
    {
        borderRadius: 15,
        borderStyle: "dashed",
        alignItems: 'center',
        width: "25%",
        justifySelf: "center"
    }

}))

export default function DragDrop(props) {

    const classes = useStyles();

    const handleDragEnter = e => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
    };
      const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    };
      const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className={classes.dragDropContainer}
          onDrop={e => handleDrop(e)}
          onDragOver={e => handleDragOver(e)}
          onDragEnter={e => handleDragEnter(e)}
          onDragLeave={e => handleDragLeave(e)}
        >
          <p>Drag files here to upload</p>
        </div>
      );

}
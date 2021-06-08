import React, { useState } from 'react'
import { Box, IconButton, makeStyles, Button } from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles((theme) => ({

    button:
    {
        height: 0.5,
        // paddingLeft: 60
    }

}))

export default function ModuleInfoEditButton({ edit, id, hideComponent }) {

    const classes = useStyles();
    // href={`/ModuleManager/${id}`}
    return (
        <div>
            {hideComponent !== true ?
                <IconButton type='submit' className={classes.button}  variant="contained" color="primary" onClick={edit}>
                    <CreateIcon />
                </IconButton>
                : null}
        </div>
    )
}
import React, { useEffect, useState } from 'react'
import config from '../config.json'
import { Box, IconButton, makeStyles, Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({

    button:
    {
        height: 0.5,
    }

}))

export default function ModuleDeleteButton(props) {

    const classes = useStyles();

    return (
        <div>
            {props.hideComponent !== true ?
                <IconButton type='submit' className={classes.button} variant="contained" color="secondary" onClick={props.delete()}>
                    <DeleteIcon />
                </IconButton>
                : null}
        </div>
    )
}
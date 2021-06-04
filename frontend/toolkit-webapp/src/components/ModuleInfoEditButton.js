import React, { useState } from 'react'
import { fade, makeStyles, IconButton, AppBar, Toolbar, Tooltip, InputBase, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon, Button } from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles((theme) => ({
    root:
    {
        display: 'flex',
        position: 'relative'

    },
    button:
    {
        // marginTop: theme.spacing(-3),
        // marginLeft: theme.spacing(205),
        // alignItems: "center",
        // justifyContent: "center",
        //marginBottom: theme.spacing(100)

    }

}))

export default function ModuleInfoEditButton({ hideComponent }) {

    const classes = useStyles();

    return (

        <div className={classes.root}>
            {hideComponent !== true ?
            <IconButton type='submit' className={classes.button} size="small" component="span">
                <CreateIcon/>
            </IconButton>
            : null }
        </div>
    )
}
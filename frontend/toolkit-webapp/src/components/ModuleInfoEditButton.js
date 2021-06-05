import React, { useState } from 'react'
import { Link, fade, makeStyles, IconButton, AppBar, Toolbar, Tooltip, InputBase, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon, Button } from "@material-ui/core";
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

        //marginLeft: "100px"
    }

}))

export default function ModuleInfoEditButton({ edit, id, hideComponent }) {

    const classes = useStyles();
    // href={`/ModuleManager/${id}`}
    return (
        <div className={classes.root}>
            {hideComponent !== true ?
                <Button type='submit' className={classes.button} size="large" variant="contained" color="primary" onClick={edit}>
                    Edit Modules
                </Button>
                : null}
        </div>
    )
}
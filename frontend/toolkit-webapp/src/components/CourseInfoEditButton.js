import React, { useState } from 'react'
import { fade, makeStyles, IconButton, AppBar, Toolbar, Tooltip, InputBase, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root:
    {
        display: 'flex',
    },
    button:
    {
        //marginTop: theme.spacing(15),
        marginLeft: theme.spacing(175),
        //marginBottom: theme.spacing(10)
    }

}))

export default function CourseInfoEditButton({ search, hideComponents }) {

    const classes = useStyles();

    return (

        <div className={classes.root}>
            <Button type='submit' className={classes.button} size="medium" variant="contained">
                Edit course info
            </Button>
        </div>
    )
}
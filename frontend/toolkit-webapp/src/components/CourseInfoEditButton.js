import React, { useState } from 'react'
import { fade, makeStyles, IconButton, AppBar, Toolbar, Tooltip, InputBase, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root:
    {
        display: 'flex',
        position: 'relative',
        
    },
    button:
    {
        marginTop: "20%",
        // marginLeft: theme.spacing(150),
        // alignItems: "center",
        //justifyContent: "center",
        //alignSelf: "auto",

        //marginBottom: theme.spacing(100)

        //marginLeft: "10%"

        marginRight: "5%",

    }

}))


export default function CourseInfoEditButton(props) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            {props.hideComponent !== true ?
            <Button type='submit' className={classes.button} size="large" variant="contained" color="primary" onClick={props.edit}>
                Edit course info
            </Button>
            : null }
            {props.hideComponent === true ?
            <Button type='submit' className={classes.button} size="large" variant="contained" color="primary" onClick={props.edit}>
                Upload image
            </Button>
            : null }
        </div>
    )
}
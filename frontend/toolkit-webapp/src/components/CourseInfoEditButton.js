import React, { useState } from 'react'
import { fade, makeStyles, IconButton, AppBar, Toolbar, Tooltip, InputBase, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root:
    {
        display: 'flex',
        position: 'relative'

    },
    button:
    {
        marginTop: theme.spacing(-5),
        marginLeft: theme.spacing(175),
        alignItems: "center",
        justifyContent: "center",
        //marginBottom: theme.spacing(100)

    }

}))


export default function CourseInfoEditButton({ hideComponent }) {

    const classes = useStyles();
    const [editCourseInfo, setEditCourseInfo] = useState(false)
    const [test, setTest] = useState(2)

    const onEditCourseTitle = (e) => {
        alert("you have pressed the button");
        setEditCourseInfo(true);
    };

    return (

        <div className={classes.root}>
            {hideComponent !== true ?
            <Button type='submit' className={classes.button} size="medium" variant="contained" onClick={onEditCourseTitle}>
                Edit course info
            </Button>
            : null }
        </div>
    )
}
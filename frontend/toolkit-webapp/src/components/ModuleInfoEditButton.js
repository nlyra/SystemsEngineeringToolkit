import React, { useState } from 'react'
import { Box, IconButton, makeStyles, Button, Link } from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles((theme) => ({

    button:
    {
        height: 0.5,
        // paddingLeft: 60
    }

}))

export default function ModuleInfoEditButton({ module, hideComponent }) {

    const classes = useStyles();
    // href={`/ModuleManager/${id}`}
    //${courseID}/
    //onClick={(e) => edit(moduleID)}
    const sendModule = () => {
        localStorage.setItem("module", JSON.stringify(module))
    }

    return (
        <div>
            { hideComponent !== true ?
                <Link href={`/editModule/${module.id}`} onClick={sendModule}>
                    <IconButton type='submit' className={classes.button} variant="contained" color="primary" >
                        <CreateIcon />
                    </IconButton>
                </Link>
                : null}
        </div>
    )
}
import React, { useEffect, useState } from 'react'
import { Box, IconButton, makeStyles, Button } from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

    button:
    {
        height: 0.5,
        // paddingLeft: 60
    }

}))

export default function ModuleInfoEditButton(props) {

    const classes = useStyles();
    // href={`/ModuleManager/${id}`}
    //${courseID}/
    //onClick={(e) => edit(moduleID)}
    // useEffect(() => {
    //     console.log(courseID)
    //   }, []);

    const sendModule = () => {
        localStorage.setItem("module", JSON.stringify(props.module))
    }

    return (
        <div>
            { props.hideComponent !== true ?
                <Link to={{pathname: `/editModule/${props.courseID}`, moduleIndex: props.moduleIndex}} onClick={sendModule}>
                    <IconButton type='submit' className={classes.button} variant="contained" color="primary" >
                        <CreateIcon />
                    </IconButton>
                </Link>
                : null}
        </div>
    )
}
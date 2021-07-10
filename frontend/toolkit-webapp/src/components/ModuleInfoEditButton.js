import React, { useEffect, useState } from 'react'
import { Box, IconButton, makeStyles, Button } from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

    button:
    {
        height: 0.5,
    }

}))

export default function ModuleInfoEditButton(props) {

    const classes = useStyles();

    const sendModule = () => {
        sessionStorage.clear()
        localStorage.setItem("module", JSON.stringify(props.module))
        if(props.module.type === "Quiz"){
            sessionStorage.setItem("quiz", JSON.stringify(props.module.quiz))
        }
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
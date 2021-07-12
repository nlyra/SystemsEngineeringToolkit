import React, { useState, useEffect } from 'react'
import { Box, Collapse, IconButton, TableBody, TableRow, TableCell, Button, Card, CardActions, Container, CssBaseline, makeStyles, Grid, CardMedia, CardContent, Typography, Table } from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import VideoModule from '../components/VideoModule'
import PdfModule from '../components/PdfModule'
import '../css/dashboard.css'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import Pagination from '@material-ui/lab/Pagination'
import dashStyles from '../styles/dashboardStyle'

const changeParams = (start, finish) => {
    start = start + 1
    finish = finish + 1
    console.log("start " + start)

}
const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const Module = (props) => {
    const { module } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="module">
                    {module.title}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography >
                                Type: {module.type}
                                <br />
                                <br />
                                {module.description}
                                <br />
                                <br />
                                <div >
                                    {module.type === "Video" && <VideoModule fileUrl={module.fileUrl} />}
                                    {module.type === "Pdf" && <PdfModule fileUrl={module.fileUrl} />}
                                </div>
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

const Dashboard = (props) => {
    const [course, setCourse] = useState({})
    const [modules, setModules] = useState([])
    const [courseID, setCourseID] = useState('')

    const classes = dashStyles()

    // function that will run when page is loaded
    useEffect(() => {
        const pathname = window.location.pathname.split('/') //returns the current path
        const id = pathname[pathname.length - 1]
        getCourse(id)
    }, []);

    const getCourse = async (id) => {
        const token = localStorage.getItem("token");
        let res = undefined

        res = await fetch(config.server_url + config.paths.course, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "id": id })
        })

        const data = await res.json()

        if (data.newToken != undefined)
            localStorage.setItem("token", data.newToken)


        if (data.message === undefined) {
            setCourse(data.course);
            setCourseID(id);
            setModules(data.course.modules);
        } else if (data.message === "wrong token") {
            localStorage.removeItem('token');
            props.history.push('login');
            // probably alert the user
        } else { // this is to check if there are errors not being addressed already
            console.log(data)
        }
    }

    const onCourse = (course) => {
        props.history.push(`course/${course._id}`);
    }


    return (
        <div className={classes.div}>
            <TopNavBar
                page={true}
            ></TopNavBar>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.container}>
                <div className='modules'>
                    <Table>
                        <TableBody>
                            {modules.map((module) => (
                                <Module key={module.id} module={module} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* <Pagination count={6} page={page} onChange={handlePage} variant="outlined" shape="rounded" /> */}
            </Container>
        </div>
    )
}

export default Dashboard
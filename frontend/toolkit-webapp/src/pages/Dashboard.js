<<<<<<< HEAD
import React, { useState } from 'react'
import {AppBar, Toolbar, Button, Card, CardActions, Container, CssBaseline, 
        Divider, makeStyles, Grid, CardMedia, CardContent, Typography, Paper,
        IconButton, Menu} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import '../css/dashboard.css'
import '../components/TopNavBar'
import TopNavBar from '../components/TopNavBar'

const useStyles = makeStyles((theme) => ({
=======
import React, { useState, useEffect } from 'react'
import { Button, Card, CardActions, Container, CssBaseline, makeStyles, Grid, CardMedia, CardContent, Typography } from '@material-ui/core'
import '../css/dashboard.css'
import config from '../config.json'
import TopNavBar from '../components/topNavBar'
import Pagination from '@material-ui/lab/Pagination'

const dashStyles = makeStyles((theme) => ({
>>>>>>> 4c83730e469981fe5dca346ff223c5ee865ac639

    container:
    {
        marginTop: theme.spacing(15)
    },

    card:
    {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },

    cardMedia:
    {
        paddingTop: '56.25%',
        size: '30%'
    },

    CardContent:
    {
        flexGrow: 1,
    },
    grow:
    {
        flexGrow: 1
    },
}))

<<<<<<< HEAD
const cards = [1, 2, 3, 4, 5, 6]
const Dashboard = () => {

    const classes = useStyles()
    return (
        <div>
            <TopNavBar>
            </TopNavBar>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.container}>
                <div className='createModules'>
                    <Grid container spacing={3} justify="center">
                        <Grid item>
                            <Button variant="contained">
                                Create Course
                            </Button>
=======
const changeParams = (start, finish) => {
    start = start + 1
    finish = finish + 1
    console.log("start " + start)

}

const worked = () => {
    console.log("works")
}

const Dashboard = (props) => {
    const [courses, setCourses] = useState([])
    const [page, setPage] = useState(1)
    const [coursesPerPage, setCoursesPerPage] = useState(5)
    // const [searchQuery, setSearchQuery] = useState([])

    const classes = dashStyles()

    // function that will run when page is loaded
    useEffect(() => {
        loadCourses();
    }, []);

    const handlePage = (event, value) => {
        // console.log(value)
        // console.log(page)
        setPage(value)
        // console.log(page)
        // loadCourses()
    }

    // function to get the courses 
    const loadCourses = async (query) => {
        const token = localStorage.getItem("token");
        let res = undefined
        // let skip = (page-1)*5

        res = await fetch(config.server_url + config.paths.dashboardCourses, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "search_query": query}) // + "skip": skip
        })
        // }


        const data = await res.json()
        if (data.message === undefined) {
            console.log(data.courses);
            // localStorage.setItem("token", data.token);
            setCourses(data.courses);


        } else if (data.message === "wrong token") {
            localStorage.removeItem('token');
            props.history.push('login');
            // probably alert the user
        } else { // this is to check if there are errors not being addressed already
            console.log(data)
        }
    }


    return (
        <div >
            <TopNavBar
                search={loadCourses}
            ></TopNavBar>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.container}>
                {/* <div className='createModules'>
                    <Grid container spacing={3} justify="center">
                        <Grid item>
                            <Button variant="contained" onClick={loadCourses}>
                                courses
                        </Button>
>>>>>>> 4c83730e469981fe5dca346ff223c5ee865ac639
                        </Grid>

                        <Grid item>
                            <Button variant="contained">
                                My Courses
<<<<<<< HEAD
                            </Button>
=======
                        </Button>
>>>>>>> 4c83730e469981fe5dca346ff223c5ee865ac639
                        </Grid>

                        <Grid item>
                            <Button variant="contained">
                                My Files
<<<<<<< HEAD
                            </Button>
=======
                        </Button>
>>>>>>> 4c83730e469981fe5dca346ff223c5ee865ac639
                        </Grid>

                        <Grid item>
                            <Button variant="contained">
                                Calendar
                        </Button>
                        </Grid>

                    </Grid>
<<<<<<< HEAD
                </div>

                <div className='modules'>
                    <Grid container spacing={3}>
                        {cards.map((card) => (

                            <Grid item key={card} xs={12} sm={4} md={3}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="https://source.unsplash.com/random"
=======
                </div> */}

                <div className='modules'>
                    <Grid container spacing={3}>
                        {courses.map((course) => (

                            <Grid item key={course.name} xs={12} sm={4} md={3}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={course.urlImage}
>>>>>>> 4c83730e469981fe5dca346ff223c5ee865ac639
                                        title="Title"
                                    />
                                    <CardContent className={classes.CardContent}>
                                        <Typography variant="h5">
<<<<<<< HEAD
                                            Module Name
                                        </Typography>
                                        <Typography gutterBottom>
                                            Placeholder for the module content.
                                        </Typography>
                                        <CardActions>
                                            <Button variant="outlined" size="small">
                                                View Module
                                            </Button>
                                            <Button variant="outlined" size="small">
                                                Edit
                                            </Button>
=======
                                            {course.name}
                                        </Typography>
                                        <Typography gutterBottom>
                                            {course.description}
                                        </Typography>
                                        <CardActions>
                                            {/* <Button variant="outlined" size="small">
                                                View Module
                                </Button>
                                            <Button variant="outlined" size="small">
                                                Edit
                                </Button> */}
>>>>>>> 4c83730e469981fe5dca346ff223c5ee865ac639
                                        </CardActions>
                                    </CardContent>
                                </Card>
                            </Grid>

                        ))}
<<<<<<< HEAD
                    </Grid>
                </div>
=======


                    </Grid>
                </div>
                {/* <Typography>Page: {page}</Typography>
                <Pagination count={6} page={page} onChange = {handlePage} variant="outlined" shape="rounded" /> */}
>>>>>>> 4c83730e469981fe5dca346ff223c5ee865ac639
            </Container>
        </div>
    )
}

export default Dashboard

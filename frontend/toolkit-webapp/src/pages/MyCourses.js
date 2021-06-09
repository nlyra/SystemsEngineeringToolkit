import React, { useState, useEffect } from 'react'
import { Button, Card, CardActions, Container, CssBaseline, makeStyles, Grid, CardMedia, CardContent, Typography } from '@material-ui/core'
import '../css/dashboard.css'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
// import Pagination from '@material-ui/lab/Pagination'
import myCoursesStyles from '../styles/myCoursesStyle'
import jwt_decode from "jwt-decode";

const MyCourses = (props) => {
    const [courses, setCourses] = useState([])
    // const [page, setPage] = useState(1)
    // const [cardAmount, setCardAmount] = useState(3)
    // const [coursesPerPage, setCoursesPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')

    const classes = myCoursesStyles()

    // function that will run when page is loaded
    useEffect(() => {
        loadCourses();
    }, []);

    // const handlePage = (event, value) => {
    //     // setPage(value)
    //     loadCourses(undefined, value)
    // }

    // function to get the courses 
    const loadCourses = async (query, s = 1) => {

        // grabbing user id
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token)

        let res = undefined
        
        // let skip = (s - 1) * cardAmount
        // if (query == ""){
        //     setSearchQuery(undefined)
        // }else{
        //     setSearchQuery(query)
        // }

        res = await fetch(config.server_url + config.paths.myCourses, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "userID": decoded.id, "search_query": query})
        })
        // }


        const data = await res.json()
        if (data.message === undefined) {

            // console.log(data.courses);
            // localStorage.setItem("token", data.token);
            setCourses(data.courses);


        } else if (data.message === "wrong token") {
            localStorage.removeItem('token');
            props.history.push('dashboard');
            // probably alert the user
        } else { // this is to check if there are errors not being addressed already
            console.log(data)
        }
    }

    const removeCourse = async (course) => 
    {
        let res = undefined
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token)

        // let skip = (s - 1) * cardAmount
        // if (query == ""){
        //     setSearchQuery(undefined)
        // }else{
        //     setSearchQuery(query)
        // }

        res = await fetch(config.server_url + config.paths.removeCourse, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "userID": decoded.id, "courseID": course._id})
        })

        // location.reload();

    }

    const onCourse = (course) => {
        props.history.push(`course/${course._id}`);
    }


    return (
        <div className={classes.div}>
            <TopNavBar
                search={loadCourses}
                // page={page}
            ></TopNavBar>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.container}>
                <div className='modules'>
                    <Grid container spacing={3}>
                        {courses.map((course) => (

                            <Grid item key={course._id} xs={12} sm={4} md={3}>
                                <Card
                                    className={classes.card}
                                    // / / onClick={() => onCourse(course)}
                                >
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={course.urlImage}
                                        title="Title"
                                    />
                                    <CardContent className={classes.CardContent}>
                                        <Typography variant="h5">
                                            {course.name}
                                        </Typography>
                                        <Typography gutterBottom>
                                            {course.description.length < 100 ? course.description : course.description.substr(0, 100) + ' ...'}
                                        </Typography>
                                        <CardActions>
                                        </CardActions>
                                    </CardContent>
                                    <Grid container spacing={3}>
                                    <Button type='submit' className={classes.removeButton} size="small" color="primary" variant="contained" onClick={() => onCourse(course)}>
                                    View Course
                                    </Button>
                                    <Button type='submit' className={classes.removeButton} size="small" color="secondary" variant="contained" onClick={e => removeCourse(course)}>
                                    Remove Course
                                    </Button>
                                    </Grid>
                                </Card>
                            </Grid>

                        ))}


                    </Grid>
                </div>
                {/* <Pagination count={6} page={page} onChange={handlePage} variant="outlined" shape="rounded" /> */}
            </Container>
        </div>
    )
}

export default MyCourses
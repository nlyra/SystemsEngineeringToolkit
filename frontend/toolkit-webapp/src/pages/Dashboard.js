import React, { useState, useCallback, useEffect } from 'react'
import { Button, Card, CardActions, Container, CssBaseline, IconButton, makeStyles, Grid, CardMedia, CardContent, Typography } from '@material-ui/core'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Waypoint } from "react-waypoint";
// import Pagination from '@material-ui/lab/Pagination'
import dashStyles from '../styles/dashboardStyle'

import { useBottomScrollListener } from 'react-bottom-scroll-listener';

const Dashboard = (props) => {
    const [courses, setCourses] = useState([])
    const [next, setHasNext] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(true);
    const [totalCourses, setTotalCourses] = useState(0)
    const cardAmount = 10

    const classes = dashStyles()

    // function that will run when page is loaded
    useEffect(() => {
        loadCourses(undefined, next+1);
    }, []);


    const loadMoreCourses = useCallback(() => {

        if ((totalCourses === courses.length))
            return 
            
        loadCourses(undefined, next+1)
      })

    // function to get the courses 
    const loadCourses = async (query, next) => {
        
        const token = localStorage.getItem("token");
        let res = undefined
        let skip = (next - 1) * cardAmount

        res = await fetch(config.server_url + config.paths.dashboardCourses, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "search_query": query, "skip": skip, "cardAmount": cardAmount })
        })

        const data = await res.json()
        if (data.status === "loading") {
           
            setCourses(courses.concat(data.courses));
            setTotalCourses(data.totalCourses)
            setHasNext(next)

        } 
        else if (data.status === "search")
        {
            setCourses(data.courses);
            setTotalCourses(data.totalCourses)
        }

        if (data.message === "wrong token") {
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

    useBottomScrollListener(loadMoreCourses);

    return (
        <div className={classes.div} >
            <TopNavBar
                search={loadCourses}
                // page={page}
            ></TopNavBar>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.container} >
                <div className='courses' >
                    <Grid container spacing={3}>
                        {courses.map((course, i) => (

                            <Grid item key={course._id} xs={12} sm={4} md={3}>
                                <Card
                                    className={classes.card}
                                    onClick={() => onCourse(course)}
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
                                            {course.description.length < 100 ? course.description : course.description.substr(0, 100) + '...'}
                                        </Typography>
                                        <CardActions>
                                        </CardActions>
                                    </CardContent>
                                </Card>
                
                                {/* {courses.length < 5 && (<Waypoint onEnter={testing}/>)} */}
                            </Grid>

                        ))}


                    </Grid>
                </div>
                
                {totalCourses !== courses.length &&
                    
                    <div className={classes.expandMoreIcon}>
                    <IconButton disableRipple size='large' style={{ backgroundColor: 'transparent' }}>{totalCourses} {courses.length}<ExpandMoreIcon /></IconButton>
                    </div>
                }
            </Container>
        </div>
    )
}

export default Dashboard
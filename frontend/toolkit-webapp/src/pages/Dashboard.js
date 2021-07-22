import React, { useState, useCallback, useEffect } from 'react'
import { Card, CardActions, Container, CssBaseline, IconButton, Grid, CardMedia, CardContent, Typography } from '@material-ui/core'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import dashStyles from '../styles/dashboardStyle'

// Allows for endless scrolling
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

const Dashboard = (props) => {
    const [courses, setCourses] = useState([])
    const [next, setHasNext] = useState(0)
    const [totalCourses, setTotalCourses] = useState(0)
    const cardAmount = 12

    const classes = dashStyles()

    // function that will run when page is loaded
    useEffect(() => {
        loadCourses(undefined, next + 1);
    }, []);

    // Function that occurs when scrollbar hits bottom of page - disabled for search, hence the checks
    const loadMoreCourses = useCallback(() => {

        // total courses is set to undefined if we are in search
        if ((totalCourses === undefined || totalCourses === courses.length))
            return

        loadCourses(undefined, next + 1)
    })

    // function to get the courses from the db
    const loadCourses = async (query, currNext) => {

        if (query === '') {
            currNext = 1
        }

        // we stop searching so return to top of page
        if (query !== undefined) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
        const token = localStorage.getItem("token");
        let res = undefined

        // skip allows us to define how many courses to skip when loading in courses
        let skip = (currNext - 1) * cardAmount

        // Call backend to load courses, with skip in the body of the call to skip courses already loaded in 
        res = await fetch(config.server_url + config.paths.dashboardCourses, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "search_query": query, "skip": skip, "cardAmount": cardAmount })
        })

        const data = await res.json()

        if (data.newToken !== undefined)
            localStorage.setItem("token", data.newToken)

        // We are in the main page, not searching
        if (data.status === "loading") {

            if (query === "") {
                setCourses(data.courses)
            } else
                setCourses(courses.concat(data.courses));

            setTotalCourses(data.totalCourses)
            setHasNext(currNext)

        }
        // We are searching so the courses processing must occur differently
        else if (data.status === "search") {
            setCourses(data.courses);
            setTotalCourses(data.totalCourses)

        }

        if (data.message === "wrong token") {
            localStorage.removeItem('token');
            props.history.push('login');
        } else {
            console.log(data)
        }
    }

    // Clicking on a course brings us to the course page
    const onCourse = (course) => {
        props.history.push(`course/${course._id}`);
    }

    // Calls function when scrollbar reaches bottom
    useBottomScrollListener(loadMoreCourses);

    return (
        <div className={classes.div} >
            <TopNavBar
                search={loadCourses}
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
                                        image={config.server_url + course.urlImage}
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

                            </Grid>

                        ))}


                    </Grid>
                </div>

                {totalCourses !== undefined && totalCourses !== courses.length &&

                    <div className={classes.expandMoreIcon}>
                        <IconButton disableRipple size='large' style={{ backgroundColor: 'transparent' }}> Scroll for More<ExpandMoreIcon /></IconButton>
                    </div>
                }
            </Container>
        </div>
    )
}

export default Dashboard
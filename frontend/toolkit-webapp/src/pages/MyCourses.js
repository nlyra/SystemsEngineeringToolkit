import React, { useState, useEffect } from 'react'
import { Button, Card, CardActions, Container, CssBaseline, Divider, makeStyles, Grid, CardMedia, CardContent, Typography } from '@material-ui/core'
import { Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
// import Pagination from '@material-ui/lab/Pagination'
import myCoursesStyles from '../styles/myCoursesStyle'
import jwt_decode from "jwt-decode";
import { Link } from '@material-ui/core';

const MyCourses = (props) => {
    const [courses, setCourses] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [openDialog, setOpenDialog] = useState(false);

    const classes = myCoursesStyles()

    // function that will run when page is loaded
    useEffect(() => {
        loadCourses();
    }, []);

    // function to get the courses 
    const loadCourses = async (query, s = 1) => {

        // grabbing user id
        const token = localStorage.getItem("token");

        let res = undefined

        res = await fetch(config.server_url + config.paths.myCourses, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "search_query": query })
        })


        const data = await res.json()

        if (data.newToken != undefined)
            localStorage.setItem("token", data.newToken)

        if (data.message === undefined) {

            setCourses(data.courses);


        } else if (data.message === "wrong token") {
            localStorage.removeItem('token');
            props.history.push('login');
            // probably alert the user
        } else { // this is to check if there are errors not being addressed already
            console.log(data)
        }
    }

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    const removeEnrollment = async (id) => 
    {
        let res = undefined
        const token = localStorage.getItem("token");

        res = await fetch(config.server_url + config.paths.removeEnrollment, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "courseID": id })
        })

        // This splits the array correctly and updates courses array with courses the user is still enrolled in
        // const newVal = courses.filter((courses) => courses._id !== id);
        // setCourses(newVal)

        const data = await res.json()
        
        if(data.newToken != undefined)
          localStorage.setItem("token", data.newToken)
          

        window.location.reload()

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
                <Grid container spacing={3}>
                    <div className={classes.header}>
                        <h1>
                            Enrolled Courses
                        </h1>
                    </div>
                </Grid>
                <Divider className={classes.divider} />
                <div className='modules'>
                    <Grid container spacing={3}>
                        {courses.map((course) => (

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
                                        {/* <CardActions>
                                        </CardActions> */}
                                    </CardContent>
                                    <Grid container spacing={3}>
                                    </Grid>
                                </Card>

                                <div className={classes.buttonDiv}>
                                    <Button type='submit' className={classes.removeButton} size="small" color="inherit" variant="contained" onClick={() => { if (window.confirm('Are you sure you wish to disenroll? Your progress may be lost.')) removeEnrollment(course._id) }}>
                                        Disenroll Course
                                    </Button>
                                </div>

                                {openDialog === true ?

                                    <div className={classes.dialog}>
                                        <Dialog onClose={handleCloseDialog} classes={{paper: classes.dialogPaper}} BackdropProps={{ style: { backgroundColor: 'rgba(193, 193, 187, 0.2)' } }} aria-labelledby="customized-dialog-title" open={openDialog}>
                                            <div className={classes.dialogTitleDiv}>
                                                <DialogTitle id="customized-dialog-title" className={classes.dialogTitle} onClose={handleCloseDialog}>
                                                    Are you sure you wish to disenroll from this course? 
                                                </DialogTitle>
                                            </div>
                                            <DialogContent className={classes.dialogContent}>
                                                
                                                <Button className={classes.dialogButton1} size="small" variant="contained" type= 'submit' onClick={() => removeEnrollment(course._id)}>
                                                        Yes
                                                    </Button>
                                                    <Button className={classes.dialogButton2}  size="small" variant="contained" type='submit' onClick={handleCloseDialog} >
                                                        No
                                                    </Button>
                                               
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    : null}
                                
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
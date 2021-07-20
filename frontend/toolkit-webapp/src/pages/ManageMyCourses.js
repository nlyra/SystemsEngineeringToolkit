import React, { useState, useEffect } from 'react'
import { Button, Card, CardActions, Container, CssBaseline, Divider, makeStyles, TextField, Grid, CardMedia, CardContent, Typography } from '@material-ui/core'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
// import Pagination from '@material-ui/lab/Pagination'
import { Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core'
import myCoursesStyles from '../styles/myCoursesStyle'
import dialogStyles from '../styles/dialogStyle'
import DialogComponent from '../components/DialogComponent'
import jwt_decode from "jwt-decode";
import { Link } from '@material-ui/core';

const ManageMyCourses = (props) => {
    const [courses, setCourses] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [openDialog, setOpenDialog] = useState(false);

    const classes = myCoursesStyles()
    const dialogClasses = dialogStyles()

    // function that will run when page is loaded
    useEffect(() => {
        loadCourses();
    }, []);

    // function to get the courses 
    const loadCourses = async (query, s = 1) => {

        // grabbing token
        const token = localStorage.getItem("token");

        let res = undefined

        res = await fetch(config.server_url + config.paths.myCreatedCourses, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "search_query": query })
        })
        // }


        const data = await res.json()

        if (data.newToken != undefined)
            localStorage.setItem("token", data.newToken)

        if (data.message === "unauthorized") {
            props.history.push('dashboard');
        } else if (data.message === undefined) {

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

    const deleteCourse = async (id) => 
    {
        let res = undefined
        const token = localStorage.getItem("token");

        res = await fetch(config.server_url + config.paths.deleteCreatedCourse, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "courseID": id })
        })

        handleCloseDialog()
        window.location.reload()

        const data = await res.json()

        if (data.newToken != undefined)
            localStorage.setItem("token", data.newToken)

        if (data.message === "unauthorized") {
            props.history.push('dashboard');
        }
        // This splits the array correctly and updates courses array with courses the user is still enrolled in
        // const newVal = courses.filter((courses) => courses._id !== id);
        // setCourses(newVal)
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
                            Manage My Courses
                        </h1>
                    </div>
                </Grid>
                <Divider className={classes.divider} />
                <div className='modules'>
                    <Grid container spacing={3}>
                        {courses.map((course) => (

                            <Grid item key={course._id} xs={12} sm={4} md={3} className={classes.cardGrid}>
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
                                    <Button type='submit' className={classes.removeButton} size="small" color="inherit" variant="contained" onClick={handleOpenDialog}>
                                        Delete Course
                                    </Button>
                                </div>

                                <DialogComponent 
                                    open={openDialog} 
                                    text={"Are you sure you wish to delete this course permanently?"}
                                    onClose={handleCloseDialog}
                                    buttons={[
                                        {text: "Yes", style: dialogClasses.dialogButton1, onClick: () => deleteCourse(course._id)}, 
                                        {text: "No", style: dialogClasses.dialogButton2, onClick: handleCloseDialog}
                                    ]}
                                />

                                {/* {openDialog === true ?

                                    <div className={classes.dialog}>
                                        <Dialog onClose={handleCloseDialog} aria-labelledby="customized-dialog-title" classes={{paper: classes.dialogPaper}} BackdropProps={{ style: { backgroundColor: 'rgba(193, 193, 187, 0.2)' } }} open={openDialog}>
                                            <div className={classes.dialogTitleDiv}>
                                                <DialogTitle id="customized-dialog-title" className={classes.dialogTitle} onClose={handleCloseDialog}>
                                                    Are you sure you wish to delete this course permanently?
                                                </DialogTitle>
                                            </div>
                                            <DialogContent className={classes.dialogContent}>
                                                
                                                <Button className={classes.dialogButton1} size="small" variant="contained" type= 'submit' onClick={() => deleteCourse(course._id)}>
                                                        Yes
                                                    </Button>
                                                    <Button className={classes.dialogButton2}  size="small" variant="contained" type='submit' onClick={handleCloseDialog} >
                                                        No
                                                    </Button>
                                               
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    : null} */}
                            </Grid>

                        ))}


                    </Grid>
                </div>
                {/* <Pagination count={6} page={page} onChange={handlePage} variant="outlined" shape="rounded" /> */}
            </Container>
        </div>
    )
}

export default ManageMyCourses
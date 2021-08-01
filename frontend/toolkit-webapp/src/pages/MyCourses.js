import React, { useState, useEffect } from 'react'
import { Button, Card, Container, CssBaseline, Divider, Grid, CardMedia, CardContent, Typography } from '@material-ui/core'
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import myCoursesStyles from '../styles/myCoursesStyle'

const MyCourses = (props) => {
    const [courses, setCourses] = useState([])
    const [openDialog, setOpenDialog] = useState(false);
    const [courseID, setCourseID] = useState('')
    const [coursesCompleted, setCoursesCompleted] = useState([])
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

        if (data.newToken !== undefined)
            localStorage.setItem("token", data.newToken)

        if (data.message === undefined) {

            setCourses(data.courses);
            setCoursesCompleted(data.completedCourses)
            // console.log('hello')
             console.log(coursesCompleted.includes("60cb5e29a389673be19a9148"))

        } else if (data.message === "wrong token") {
            localStorage.removeItem('token');
            props.history.push('login');
            // probably alert the user
        } else { // this is to check if there are errors not being addressed already
            console.log(data)
        }
    }

    const handleOpenDialog = (id) => {
        setCourseID(id);
        setOpenDialog(true);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    const removeEnrollment = async (id) => {
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

        if (data.newToken !== undefined)
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

                            <Grid item key={course._id} xs={12} sm={4} md={3} className={classes.cardGrid}>
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
                                    </CardContent>
                                    <Grid container spacing={3}>
                                    </Grid>
                                </Card>
                                { !coursesCompleted.includes(course._id) &&
                                    <div className={classes.buttonDiv}>
                                        <Button type='submit' className={classes.removeButton} size="small" color="inherit" variant="contained" onClick={() => { handleOpenDialog(course._id) }}>
                                            Disenroll Course
                                        </Button>
                                    </div>
                                }

                                {openDialog === true ?

                                    <div className={classes.dialog}>
                                        <Dialog onClose={handleCloseDialog} classes={{ paper: classes.dialogPaper }} BackdropProps={{ style: { backgroundColor: 'rgba(193, 193, 187, 0.2)' } }} aria-labelledby="customized-dialog-title" open={openDialog}>
                                            <div className={classes.dialogTitleDiv}>
                                                <DialogTitle id="customized-dialog-title" className={classes.dialogTitle} onClose={handleCloseDialog}>
                                                    Are you sure you wish to disenroll from this course?
                                                </DialogTitle>
                                            </div>
                                            <DialogContent className={classes.dialogContent}>

                                                <Button className={classes.dialogButton1} size="small" variant="contained" type='submit' onClick={() => removeEnrollment(courseID)}>
                                                    Yes
                                                </Button>
                                                <Button className={classes.dialogButton2} size="small" variant="contained" type='submit' onClick={handleCloseDialog} >
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
            </Container>
        </div>
    )
}

export default MyCourses
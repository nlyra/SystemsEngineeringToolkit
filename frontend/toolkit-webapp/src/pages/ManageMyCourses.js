import React, { useState, useEffect } from 'react'
import { Button, Card, Container, CssBaseline, Divider, Grid, CardMedia, CardContent, Typography } from '@material-ui/core'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import myCoursesStyles from '../styles/myCoursesStyle'
import dialogStyles from '../styles/dialogStyle'
import DialogComponent from '../components/DialogComponent'

const ManageMyCourses = (props) => {
    const [courses, setCourses] = useState([])
    const [courseID, setCourseID] = useState('')
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

        if (data.newToken !== undefined)
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

    const handleOpenDialog = (id) => {
        setCourseID(id);
        setOpenDialog(true);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const deleteCourse = async (id) => {
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

        if (data.newToken !== undefined)
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


                                <div className={classes.buttonDiv}>
                                    <Button type='submit' className={classes.removeButton} size="small" color="inherit" variant="contained" onClick={() => handleOpenDialog(course._id)}>
                                        Delete Course
                                    </Button>
                                </div>

                                <DialogComponent
                                    open={openDialog}
                                    text={"Are you sure you wish to delete this course permanently?"}
                                    onClose={handleCloseDialog}
                                    buttons={[
                                        { text: "Yes", style: dialogClasses.dialogButton1, onClick: () => deleteCourse(courseID) },
                                        { text: "No", style: dialogClasses.dialogButton2, onClick: handleCloseDialog }
                                    ]}
                                />

                            </Grid>

                        ))}


                    </Grid>
                </div>
            </Container>
        </div>
    )
}

export default ManageMyCourses
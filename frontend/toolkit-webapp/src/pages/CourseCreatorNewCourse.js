import React, { useState } from 'react'
import { Button, FormControl, Container, TextField, Typography, Box, Select, InputLabel, FormHelperText, Paper } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import courseStyles from '../styles/courseStyle'
import '../css/Login.css';

function NewCourse(props) {

    const [courseTitle, setCourseTitle] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState()

    const classes = courseStyles()

    const handleChange = (event) => {
        setCategory(event.target.category);
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!courseTitle || !category || !description) {
            alert('Please enter all required fields')
            return
        }
        onFinish({ courseTitle, category, description })
    }

    const onUpload = (e) => {
        alert('feature undefined')
        return
    }


    const onFinish = async (creds) => {
        const token = localStorage.getItem("token");

        // handle image
        const imageData = new FormData();
        imageData.append('file', image)

        const res = await fetch(config.server_url + config.paths.createCourse, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                "token": token,
                "modules": [],
                "name": creds.courseTitle,
                "category": creds.category,
                "description": creds.description,
                "urlImage": `http://localhost:4000/${image.name}`
            })
        }
        )
        const data = await res.json()
        if (data.message === undefined) {
            const res = await fetch(config.server_url + config.paths.fileUpload, {
                method: 'POST',
                body: imageData
            })
            const data = await res.json()

            if (data.status == 'Success') {
                alert("Successfully created course!")
                props.history.push('dashboard')// needs to be changed to course manager
            } //else need to do something, not sure what rn
        }
        else { // this is to check if there are errors not being addressed already
            console.log(data)
        }




    }






    return (
        <div>
            <TopNavBar hideComponents={false} />
            <div className={classes.darkOverlay}>
            </div>
            <Container className={classes.container} >
                <div className={classes.block}>
                    <form autoComplete="off" onSubmit={onSubmit}>
                        <Paper className={classes.paper} elevation={3} square={false}>
                            <Box m={2} pt={2}>
                                <Typography className={classes.Title} variant="h5">{courseTitle == "" ? 'New Course' : courseTitle}</Typography>
                            </Box>
                            <div className={classes.TextBox}>
                                <TextField color='primary'
                                    size='small'
                                    variant="filled"
                                    label='Course Title'
                                    type="CourseTitle"
                                    value={courseTitle}
                                    onChange={e => setCourseTitle(e.target.value)}
                                    margin="normal"
                                    required={true}
                                    fullWidth
                                />

                                <FormControl required className={classes.formControl} fullWidth={true}>
                                    <InputLabel htmlFor="category-native-required">Category</InputLabel>
                                    <Select
                                        native
                                        value={category}
                                        onChange={handleChange}
                                        name="category"
                                        inputProps={{
                                            id: 'category-native-required',
                                        }}
                                        onChange={e => setCategory(e.target.value)}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={"Code"}>Code</option>
                                        <option value={"Programming"}>Programming</option>
                                        <option value={"Other"}>Other</option>
                                    </Select>
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>

                                <TextField
                                    size='small'
                                    variant="filled"
                                    multiline
                                    rows={10}
                                    rowsMax={15}
                                    label='Description'
                                    type="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    margin="normal"
                                    required={true}
                                    fullWidth
                                />

                            </div>
                            <input type="file" name="picture" onChange={e => setImage(e.target.files[0])} />
                            <Button type='submit' className={classes.button4} size="medium" variant="contained" startIcon={<ArrowForwardIcon />} onClick={onSubmit}>
                                Submit
                        </Button>
                        </Paper>
                    </form>
                </div>
            </Container>
        </div>
    )
}

export default NewCourse;
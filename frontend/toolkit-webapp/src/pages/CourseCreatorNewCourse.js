import React, { useState } from 'react'
import { Button, FormControl, Container, TextField, Typography, Box, Select, InputLabel, FormHelperText, Paper } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import config from '../config.json'
import TopNavBar from '../components/topNavBar'
import useStyles from './styles'
import '../css/Login.css';

function NewCourse(props) {

    const [courseTitle, setCourseTitle] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const classes = useStyles()

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
        setCourseTitle('')
        setCategory('')
        setDescription('')
    }

    const onUpload = (e) => {
        alert('feature undefined')
        return
    }


    const onFinish = async (creds) => {
        const res = await fetch(config.server_url + config.paths.createCourse, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "modules": [], "name": creds.courseTitle, "category": creds.category, "description": creds.description, "url": 'http://localhost:4000/java.jpg'})
        })

        const data = await res.json()

        if (data.message === undefined) {
            props.history.push('dashboard')
        }
        else { // this is to check if there are errors not being addressed already
            console.log(data)
        }
    }
    /*


    */
    return (
        <div>
            <TopNavBar></TopNavBar>
            <Container className={classes.container} >
                <div className={classes.block}>
                    <form autoComplete="off" onSubmit={onSubmit}>
                    <Paper className={classes.paper} elevation={3} square={false}>
                        <Box m={2} pt={2}>
                            <Typography className={classes.Title} variant="h5">Course Creator</Typography>
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
                        <Button type='submit' className={classes.button3} size="medium" variant="contained" startIcon={<CloudUploadIcon/>} onClick={onUpload}>
                            Insert Cover Photo
                        </Button>
                        <Button type='submit' className={classes.button4} size="medium" variant="contained" startIcon={<ArrowForwardIcon/>} onClick={onSubmit}>
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
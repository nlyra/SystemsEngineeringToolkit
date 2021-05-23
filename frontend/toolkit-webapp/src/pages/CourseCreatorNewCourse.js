import React, { useState } from 'react'
import { Button, FormControl, Container, TextField, Typography, Box, Select, InputLabel, FormHelperText } from '@material-ui/core'
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
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const classes = useStyles()

    const handleChange = (event) => {
        setCategory(event.target.category);
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!email || !password) {
            alert('Please enter Email and Password')
            return
        }
        onLogin({ email, password })
        setEmail('')
        setPassword('')
    }

    /*
    const onUpload = (e) => {

    }
    */

    const onLogin = async (creds) => {
        const res = await fetch(config.server_url + config.paths.login, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "email": creds.email, "password": creds.password })
        })

        const data = await res.json()

        if (data.message === undefined) {
            localStorage.setItem("token", data.token);
            props.history.push('dashboard')

        } else if (data.message === "wrong email or password") {
            alert("Wrong email or password, please try again.");
        } else { // this is to check if there are errors not being addressed already
            console.log(data)
        }

    }
    /*
    <Paper className={classes.paper} elevation={5} square={false}>
    </Paper>
                                <TextField
                                    size='small'
                                    variant="filled"
                                    label='Category'
                                    type="category"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    margin="normal"
                                    required={true}
                                    fullWidth
                                />
    */
    return (
        <div>
            <TopNavBar></TopNavBar>
            <Container className={classes.container} maxWidth="lg">
                <div className={classes.block}>
                    <form autoComplete="off" onSubmit={onSubmit}>

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
                                <InputLabel htmlFor="age-native-required">Category</InputLabel>
                                <Select
                                    native
                                    value={category}
                                    onChange={handleChange}
                                    name="category"
                                    inputProps={{
                                        id: 'age-native-required',
                                    }}
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
                        <Button type='upload' className={classes.button3} size="medium" variant="contained" startIcon={<CloudUploadIcon />}>
                            Insert Cover Photo
                        </Button>
                        <Button type='submit' className={classes.button4} size="medium" variant="contained" startIcon={<ArrowForwardIcon />}>
                            Submit
                        </Button>


                    </form>
                </div>
            </Container>
        </div>
    )
}

export default NewCourse;
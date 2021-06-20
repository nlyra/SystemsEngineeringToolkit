import React, { useState, useEffect } from 'react'
import { Button, FormControl, Container, TextField, Typography, Box, Select, InputLabel, FormHelperText, Paper } from '@material-ui/core'
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import useStyles from '../styles/moduleStyle'
import '../css/Login.css';
import FileModule from '../components/FileModule'
import QuizCreatorModule from '../components/QuizCreatorModule'

function ModuleEditor(props) {

    const [module, setModule] = useState(JSON.parse(localStorage.getItem("module")))
    const [title, setTitle] = useState(module.title)
    const [type, setType] = useState(module.type)
    const [description, setDescription] = useState(module.description)
    const [courseID, setCourseID] = useState('')

    const classes = useStyles()

    const handleChange = (event) => {
        setType(event.target.type);
        // handleDisplayedContent(type)
    }

    useEffect(() => {
        const pathname = window.location.pathname.split('/') //returns the current path
        setCourseID(pathname[pathname.length - 1])
        sessionStorage.setItem('quiz', JSON.stringify(module.quiz))
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()
        if (!title || !type || !description) {
            alert('Please enter all required fields')
            return
        }

        if (type === 'Quiz' && JSON.parse(sessionStorage.getItem('quiz')) !== null) {
            console.log('works for Quiz')
            var quiz = []

            quiz = JSON.parse(sessionStorage.getItem("quiz"))
            sessionStorage.clear()
            onFinish({ title, type, description, quiz })
        } else {
            console.log('works')
            onFinish({ title, type, description })
        }
    }

    // We ideally want to redirect to module manager page, but we do not have that yet
    const cancel = () => {
        props.history.push(`/course/${courseID}`)
    }

    const onFinish = async (module) => {

        const token = localStorage.getItem("token");
        if (token != undefined) {
            let res = undefined
            if (module.type === "Quiz") {
                res = await fetch(config.server_url + config.paths.editModule, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ 'token': token, 'moduleID': props.location.moduleIndex, 'courseID': courseID, 'title': module.title, 'description': module.description, 'type': module.type, 'quiz': module.quiz })
                })
            } else {
                res = await fetch(config.server_url + config.paths.editModule, {

                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ 'token': token, 'moduleID': props.location.moduleIndex, 'courseID': courseID, 'title': module.title, 'description': module.description, 'type': module.type })
                })
            }

            const data = await res.json()

            if (data.message === undefined) {
                // probably change back to course manager 
                alert('worked')
                props.history.push(`/course/${courseID}`)
            }
            else { // this is to check if there are errors not being addressed already
                console.log(data)
            }
        }
        else {
            props.history.push('login')
        }

    }

    return (
        <div>
            <TopNavBar></TopNavBar>
            <Container className={classes.container} >
                <div className={classes.block}>
                    <form autoComplete="off" onSubmit={onSubmit}>
                        <Paper className={classes.paper} elevation={3} square={false}>
                            <Box m={2} pt={2}>
                                <Typography className={classes.Title} variant="h5">{title == "" ? 'New Module' : title}</Typography>
                            </Box>
                            <div className={classes.TextBox}>
                                <TextField color='primary'
                                    size='small'
                                    variant="filled"
                                    label='Title'
                                    type="title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    margin="normal"
                                    required={true}
                                    fullWidth
                                />
                                <TextField
                                    size='small'
                                    variant="filled"
                                    multiline
                                    rows={3}
                                    rowsMax={15}
                                    label='Description'
                                    type="body"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    margin="normal"
                                    required={true}
                                    fullWidth
                                />

                                <FormControl required className={classes.formControl} fullWidth={true}>
                                    <InputLabel htmlFor="category-native-required">Module Type</InputLabel>
                                    <Select
                                        native
                                        value={type}
                                        onChange={handleChange}
                                        name="Module Type"
                                        inputProps={{
                                            id: 'category-native-required',
                                        }}
                                        onChange={e => setType(e.target.value)}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={"Quiz"}>Quiz</option>
                                        <option value={"Video"}>Video</option>
                                        <option value={"Files"}>Files</option>
                                    </Select>
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>

                                {type == 'Files' && <FileModule></FileModule>}
                                {type == 'Quiz' && <QuizCreatorModule></QuizCreatorModule>}

                            </div>
                            <Container className={classes.buttonGroup}>
                                <Button type='submit' className={classes.button1} size="small" variant="contained" onClick={cancel}>
                                    Cancel
                                </Button>
                                <Button type='submit' className={classes.button2} size="small" variant="contained" onSubmit={onSubmit}>
                                    Update
                                </Button>
                            </Container>
                        </Paper>
                    </form>
                </div>
            </Container>
        </div>
    )
}

export default ModuleEditor;
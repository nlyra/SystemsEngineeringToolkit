import React, { useState, useEffect } from 'react'
import { Button, FormControl, Container, TextField, Typography, Box, Select, InputLabel, FormHelperText, Paper } from '@material-ui/core'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import useStyles from '../styles/moduleStyle'
import '../css/Login.css';
import FileModule from '../components/FileModule'
import QuizModule from '../components/QuizModule'

function ModuleCreator(props) {

    const [title, setTitle] = useState('')
    const [type, setType] = useState('')
    const [description, setDescription] = useState('')
    const [module, setModule] = useState({})
    const [moduleID, setModuleID] = useState('')
    const [courseID, setCourseID] = useState('')

    const classes = useStyles()

    const handleChange = (event) => {
        setType(event.target.type);
        // handleDisplayedContent(type)
    }

    // function that will run when page is loaded
    useEffect(() => {
        const pathname = window.location.pathname.split('/') //returns the current path
        const id = pathname[pathname.length - 1]
        getCourse(id)
    }, []);

    const getCourse = async (id) => {
        const token = localStorage.getItem("token");
        let res = undefined

        res = await fetch(config.server_url + config.paths.editModule, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "token": token, "id": id })
        })

        const data = await res.json()

        if (data.message === undefined) {
            setCourseID(id);
        } else if (data.message === "wrong token") {
            localStorage.removeItem('token');
            props.history.push('login');
            // probably alert the user
        } else { // this is to check if there are errors not being addressed already
            console.log(data)
        }
    }
    const onSubmit = (e) => {
        e.preventDefault()
        if (!title || !type || !description) {
            alert('Please enter all required fields')
            return
        }

        if (type === 'Quiz') {
            console.log('works for Quiz')
            var quizArray = {
                questions: JSON.parse(sessionStorage.getItem('questions')),
                types: JSON.parse(sessionStorage.getItem('types')),
                answers: JSON.parse(sessionStorage.getItem('answers')),
                fakes1: JSON.parse(sessionStorage.getItem('fakes1')),
                fakes2: JSON.parse(sessionStorage.getItem('fakes2')),
                fakes3: JSON.parse(sessionStorage.getItem('fakes3'))
            }
            var quiz = []

            for (var i = 0; i < quizArray.questions.length; i++) {
                quiz.push({
                    question: quizArray.questions[i],
                    type: quizArray.types[i],
                    answers: [
                        { answerText: quizArray.answers[i], isCorrect: true },
                        { answerText: quizArray.fakes1[i], isCorrect: false },
                        { answerText: quizArray.fakes2[i], isCorrect: false },
                        { answerText: quizArray.fakes3[i], isCorrect: false },
                    ]

                })
            }

            sessionStorage.clear()
            //console.log(quiz)
            onFinish({ title, type, description, quiz })
        } else {
            console.log('works')
            onFinish({ title, type, description })
        }
    }

    // const onUpload = (e) => {
    //     alert('feature undefined')
    //     return
    // }

    // We ideally want to redirect to module manager page, but we do not have that yet
    const cancel = () => {
        props.history.push('dashboard')
    }

    const onFinish = async (module) => {
        const token = localStorage.getItem("token");
        if (token != undefined) {
            let res = undefined
            if (module.type === "Quiz") {
                res = await fetch(config.server_url + config.paths.newModule, {

                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ 'token': token, 'courseID': '60b7dac736539526486f1503', 'title': module.title, 'description': module.description, 'type': module.type, 'quiz': module.quiz })
                })
            } else {
                res = await fetch(config.server_url + config.paths.newModule, {

                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ 'token': token, 'courseID': '60b7dac736539526486f1503', 'title': module.title, 'description': module.description, 'type': module.type })
                })
            }

            const data = await res.json()

            if (data.message === undefined) {
                // probably change back to course manager 
                alert('worked')
                props.history.push('dashboard')
            }
            else { // this is to check if there are errors not being addressed already
                console.log(data)
            }
        }
        else {
            props.history.push('login')
        }

    }

    const getFileModule = () => {
        return <FileModule></FileModule>

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
                                    defaultValue="New Module"
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

                                {type == 'Video' && <FileModule></FileModule>}
                                {type == 'Quiz' && <QuizModule></QuizModule>}

                            </div>
                            <Container className={classes.buttonGroup}>
                                <Button type='submit' className={classes.button1} size="small" variant="contained" onClick={cancel}>
                                    Cancel
                        </Button>
                                <Button type='submit' className={classes.button2} size="small" variant="contained" onSubmit={onSubmit}>
                                    Create
                        </Button>
                            </Container>
                        </Paper>
                    </form>
                </div>
            </Container>
        </div>
    )
}

export default ModuleCreator;
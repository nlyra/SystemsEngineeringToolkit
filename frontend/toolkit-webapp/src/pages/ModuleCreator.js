import React, { useState } from 'react'
import { Button, FormControl, Container, TextField, Typography, Box, Select, InputLabel, FormHelperText, Paper } from '@material-ui/core'
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import useStyles from '../styles/moduleStyle'
import '../css/Login.css';
import FileModule from '../components/FileModule'

function ModuleCreator(props) {

    const [title, setTitle] = useState('')
    const [type, setType] = useState('')
    const [body, setBody] = useState('')

    const classes = useStyles()

    const handleChange = (event) => {
        setType(event.target.type);
        // handleDisplayedContent(type)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!title || !type || !body) {
            alert('Please enter all required fields')
            return
        }
        onFinish({title, type, body})
        // setTitle('')
        // setType('')
        // setDescriptio('')
    }

    const onUpload = (e) => {
        alert('feature undefined')
        return
    }

    // We ideally want to redirect to module manager page, but we do not have that yet
    const cancel = () => {
        props.history.push('dashboard')
    }

    const onFinish = async (creds) => {

        const token = localStorage.getItem("token");
        if(token != undefined)
        {
            const res = await fetch(config.server_url + config.paths.newModule, {
            
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ "title": [], "name": creds.courseTitle, "category": creds.category, "description": creds.description, "url": 'http://localhost:4000/java.jpg'})
            })
    
            const data = await res.json()
    
            if (data.message === undefined) {
                props.history.push('dashboard')
            }
            else { // this is to check if there are errors not being addressed already
                console.log(data)
            }
        }
        else
        {
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
                            <Typography className={classes.Title} variant="h5">{ title == "" ? 'New Module' : title}</Typography>
                        </Box>
                        <div className={classes.TextBox}>
                            <TextField color='primary'
                                size='small'
                                variant="filled"
                                label='Title'
                                type="title"
                                defaultValue = "New Module"
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
                                value={body}
                                onChange={e => setBody(e.target.value)}
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

                            {type == 'Video' && <FileModule></FileModule> }

                        </div>
                        <Container className= {classes.buttonGroup}>
                        <Button type='submit' className={classes.button1} size="small" variant="contained" onClick={cancel}>
                            Cancel
                        </Button>
                        <Button type='submit' className={classes.button2} size="small" variant="contained" onSubmit={onSubmit}>
                            Continue
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
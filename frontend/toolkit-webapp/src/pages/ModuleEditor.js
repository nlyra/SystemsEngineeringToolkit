import React, { useState, useEffect } from 'react'
import { Button, FormControl, Container, TextField, Typography, Box, Select, InputLabel, FormHelperText, Paper } from '@material-ui/core'
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import useStyles from '../styles/moduleStyle'
import '../css/Login.css';
import QuizCreator from '../components/QuizCreatorModule'
import VideoCreator from '../components/VideoCreatorModule'
import PDFCreator from '../components/PDFCreatorModule'
import FileCreator from '../components/FileCreatorModule'

function ModuleEditor(props) {


    const [module, setModule] = useState(JSON.parse(localStorage.getItem("module")))
    const [title, setTitle] = useState(module.title)
    const [type, setType] = useState(module.type)
    const [description, setDescription] = useState(module.description)
    const [courseID, setCourseID] = useState('')
    const [gradeToPass, setGradeToPass] = useState(module.gradeToPass)

    const classes = useStyles()
    const [file, setFile] = useState()
    const [video, setVideo] = useState()
    const [pdf, setPDF] = useState()

    function getExtention(filename){
        var parts = filename.split('.');
        return parts[parts.length-1]
    }

    function isPDF(filename){
        var ext = getExtention(filename)
        switch(ext.toLowerCase()){
            case 'pdf':
                return true;
            default:
        }
        return false
    }
    function isVideo(filename){
        var ext = getExtention(filename)
        switch(ext.toLowerCase()){
            case 'webm':
            case 'mpg':
            case 'mp2':
            case 'mpeg':
            case 'mpe':
            case 'mpv':
            case 'ogg':
            case 'mp4':
            case 'm4p':
            case 'm4v':
            case 'avi':
            case 'wmv':
            case 'mov':
            case 'qt':
            case 'flv':
            case 'swf':
            case 'avchd':
                return true;
            default:
        }
        return false;
    }

    const handleChange = (event) => {
        setType(event.target.type);
        // handleDisplayedContent(type)
    }

    useEffect(() => {
        const pathname = window.location.pathname.split('/') //returns the current path
        setCourseID(pathname[pathname.length - 1])
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
            onFinish({ title, type, description, quiz, gradeToPass })
        }else if(type === 'PDF' && pdf !== null){
            if(isPDF(pdf.name) === false){
                alert("File must be a PDF")
            } else {
                console.log('works for PDF')
                onFinish({ title, type, description, pdf })
            }
        } else if(type === 'File' && file !== null){
            console.log('works for File')
            onFinish({ title, type, description, file })
            
        }else if(type === 'Video' && video !== null){
            if(isVideo(video.name) === false){
                alert("File must be a video")
            } else {
                console.log('works for Video')
                onFinish({ title, type, description, video })
            }
        }else {
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

        if (token !== undefined) {
            let res = undefined
            if (module.type === "Quiz") {
                res = await fetch(config.server_url + config.paths.editModule, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ 'token': token, 'moduleID': props.location.moduleIndex, 'courseID': courseID, 'title': module.title, 'description': module.description, 'type': module.type, 'quiz': module.quiz, 'gradeToPass': module.gradeToPass })
                })

                alert("Successfully Edited Quiz module")
                props.history.push('/course/'+courseID)

            }else if(module.type === "PDF"){
               
                const pdfTypePath = module.pdf.name.split('.')

                // Grabbing the actual filename minus extension so that we can validate alphanumeric inputs
                var val = pdfTypePath[pdfTypePath.length - 2];
                var RegEx = /[^0-9a-z]/i;
                var isValid = !(RegEx.test(val));

                // Input contains non-alphanumeric values so we must alert the user to rename the file 
                if (isValid === false) {
                    alert('Invalid file type. Please upload an image for which name is aplhanumeric.')
                    return
                }

                const newFile = new FormData();
                newFile.append('file', module.pdf)

                const res = await fetch(config.server_url + config.paths.editModule, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        "token": token,
                        'moduleID': props.location.moduleIndex,
                        'courseID': courseID,
                        "title": module.title,
                        'description': module.description,
                        'type': module.type,
                        "urlFile": `http://localhost:4000/`+courseID+`/moduleData/${module.pdf.name}`
                    })
                })
                const data = await res.json()
                if (data.message === undefined) {
                    const res = await fetch(config.server_url + config.paths.moduleFileUpload +"?token=" + token + "&courseID=" + courseID + "&fileName=" + module.pdf.name, {
                    method: 'POST',
                    body: newFile
                    })
                    const data2 = await res.json()
                    console.log(data2)

                    if (data2.status === 'Success') {
                        alert("Successfully Edited PDF module")
                        props.history.push('/course/'+courseID)
                    } //else need to do something, not sure what rn
                } else { // this is to check if there are errors not being addressed already
                    console.log(data)
                }
            } else if(module.type === "File"){

                const fileTypePath = module.file.name.split('.')

                // Grabbing the actual filename minus extension so that we can validate alphanumeric inputs
                var val = fileTypePath[fileTypePath.length - 2];
                var RegEx = /[^0-9a-z]/i;
                var isValid = !(RegEx.test(val));

                // Input contains non-alphanumeric values so we must alert the user to rename the file 
                if (isValid === false) {
                    alert('Invalid file type. Please upload an image for which name is aplhanumeric.')
                    return
                }

                const newFile = new FormData();
                newFile.append('file', module.file)

                const res = await fetch(config.server_url + config.paths.editModule, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        "token": token,
                        'moduleID': props.location.moduleIndex,
                        'courseID': courseID,
                        "title": module.title,
                        'description': module.description,
                        'type': module.type,
                        "urlFile": `http://localhost:4000/`+courseID+`/moduleData/${module.file.name}`
                    })
                })
                const data = await res.json()
                if (data.message === undefined) {
                    const res = await fetch(config.server_url + config.paths.moduleFileUpload +"?token=" + token + "&courseID=" + courseID + "&fileName=" + module.file.name, {
                    method: 'POST',
                    body: newFile
                    })
                    const data2 = await res.json()
                    console.log(data2)

                    if (data2.status === 'Success') {
                        alert("Successfully Edited File module")
                        props.history.push('/course/'+courseID)
                    } //else need to do something, not sure what rn
                } else { // this is to check if there are errors not being addressed already
                    console.log(data)
                }
            }else if(module.type === "Video"){

                const videoTypePath = module.video.name.split('.')
                var val = videoTypePath[videoTypePath.length - 2];

                var RegEx = /[^0-9a-z]/i;
                var isValid = !(RegEx.test(val));

                // Input contains non-alphanumeric values so we must alert the user to rename the file 
                if (isValid === false) {
                    alert('Invalid file type. Please upload an image for which name is aplhanumeric.')
                    return
                }
    
                const newVideo = new FormData();
                newVideo.append('file', module.video)
                const res = await fetch(config.server_url + config.paths.editModule, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        "token": token,
                        'moduleID': props.location.moduleIndex,
                        'courseID': courseID,
                        "title": module.title,
                        'description': module.description,
                        'type': module.type,
                        "urlVideo": `http://localhost:4000/`+courseID+`/moduleData/${module.video.name}`,
                    })
                    
                })

                const data = await res.json()
                if (data.message === undefined) {
                    const res = await fetch(config.server_url + config.paths.moduleFileUpload + "?token=" + token + "&courseID=" + courseID + "&fileName=" + module.video.name, {
                    method: 'POST',
                    body: newVideo
                    })
                    const data2 = await res.json()
                    console.log(data2)

                    if (data2.status === 'Success') {
                        alert("Successfully Edited video module")
                        props.history.push('/course/'+courseID)
                    } //else need to do something, not sure what rn
                } else { // this is to check if there are errors not being addressed already
                    console.log(data)
                }
            }else {
                res = await fetch(config.server_url + config.paths.editModule, {

                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ 'token': token, 'moduleID': props.location.moduleIndex, 'courseID': courseID, 'title': module.title, 'description': module.description, 'type': module.type })
                })

                const data = await res.json()

                if (data.message === undefined) {
                    alert('worked')
                    props.history.push('/course/'+courseID)
                }
                else { // this is to check if there are errors not being addressed already
                    console.log(data)
                }
            } 
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
                                        <option value={"File"}>File</option>
                                        <option value={"PDF"}>PDF</option>
                                        <option value={"Text"}>Text</option>
                                    </Select>
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>

                                {type === 'PDF' && <PDFCreator setPDF={setPDF} pdf={pdf}/>}
                                {type === 'Video' && <VideoCreator setVideo={setVideo} video = {video}/>}
                                {type === 'File' && <FileCreator setFile={setFile} file = {file}/>}
                                {type == 'Quiz' && <QuizCreator gradeToPass={gradeToPass} setGradeToPass={setGradeToPass}/>}

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
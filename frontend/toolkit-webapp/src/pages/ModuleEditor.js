import React, { useState, useEffect } from 'react'
import { Button, FormControl, Container, TextField, Typography, Box, Select, InputLabel, FormHelperText, Paper } from '@material-ui/core'
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import useStyles from '../styles/moduleStyle'
import '../css/Login.css';
import QuizCreator from '../components/QuizCreatorModule'
import VideoCreator from '../components/VideoCreatorModule'
import PDFCreator from '../components/PDFCreatorModule'
import FileCreator from '../components/FileCreatorModule'
import dialogStyles from '../styles/dialogStyle'
import DialogComponent from '../components/DialogComponent'

function ModuleEditor(props) {


    const module = JSON.parse(localStorage.getItem("module"))
    const [title, setTitle] = useState(module.title)
    const [type, setType] = useState(module.type)
    const [description, setDescription] = useState(module.description)
    const [courseID, setCourseID] = useState('')
    const [gradeToPass, setGradeToPass] = useState(module.gradeToPass)
    const [dialogText, setDialogText] = useState('')
    const [openDialog, setOpenDialog] = useState(false);

    const classes = useStyles()
    const dialogClasses = dialogStyles()
    const [file, setFile] = useState()
    const [video, setVideo] = useState()
    const [pdf, setPDF] = useState()

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    function getExtention(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1]
    }

    function isPDF(filename) {
        var ext = getExtention(filename)
        switch (ext.toLowerCase()) {
            case 'pdf':
                return true;
            default:
        }
        return false
    }
    function isVideo(filename) {
        var ext = getExtention(filename)
        switch (ext.toLowerCase()) {
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

    useEffect(() => {
        const pathname = window.location.pathname.split('/') //returns the current path
        setCourseID(pathname[pathname.length - 1])
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()
        if (!title || !type || !description) {
            setDialogText("Please enter all required fields.")
            handleOpenDialog()
            return
        }

        if (type === 'Quiz' && JSON.parse(sessionStorage.getItem('quiz')) !== null) {
            if (gradeToPass < 1) {
                setDialogText("The number of correct answers required must be greater than 0.")
                handleOpenDialog()
            } else {

                console.log('works for Quiz')
                var quiz = []

                quiz = JSON.parse(sessionStorage.getItem("quiz"))
                if (gradeToPass > quiz.length) {
                    setDialogText("The number of correct answers may not be greater than the number of questions.")
                    handleOpenDialog()
                } else {
                    sessionStorage.clear()
                    onFinish({ title, type, description, quiz })
                }
            }
        } else if (type === 'PDF') {
            if (pdf !== null && typeof (pdf) !== 'undefined') {
                if (isPDF(pdf.name) === false) {
                    setDialogText("File must be a PDF")
                    handleOpenDialog()
                } else {
                    console.log('works for PDF')
                    onFinish({ title, type, description, pdf })
                }
            } else if (module.type === "PDF") {
                const fileName = module.urlFile
                onFinish({ title, type, description, fileName })
            } else {
                setDialogText("Please attach proper file corresponding to module type.")
                handleOpenDialog()
            }

        } else if (type === 'File') {
            if (file !== null && typeof (file) !== 'undefined') {
                console.log('works for File')
                onFinish({ title, type, description, file })
            } else if (module.type === "File") {
                const fileName = module.urlFile
                onFinish({ title, type, description, fileName })
            } else {
                setDialogText("Please attach proper file corresponding to module type.")
                handleOpenDialog()
            }

        } else if (type === 'Video') {
            if (video !== null && typeof (video) !== 'undefined') {
                if (isVideo(video.name) === false) {
                    setDialogText("File must be a video.")
                    handleOpenDialog()
                } else {
                    console.log('works for Video')
                    onFinish({ title, type, description, video })
                }
            } else if (module.type === "Video") {
                const videoName = module.urlVideo
                onFinish({ title, type, description, videoName })
            } else {
                setDialogText("Please attach proper file corresponding to module type.")
                handleOpenDialog()
            }
        } else if (type === 'Text') {
            console.log('Works for Text')
            onFinish({ title, type, description })
        }
        else {
            setDialogText("Please attach proper file corresponding to module type.")
            handleOpenDialog()
        }
    }

    const cancel = () => {
        sessionStorage.clear()
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
                const data = await res.json()


                if (data.newToken !== undefined)
                    localStorage.setItem("token", data.newToken)


                if (data.message === "unauthorized") {
                    props.history.push('dashboard');
                } else {
                    setDialogText("Successfully Edited Quiz module")
                    handleOpenDialog()
                    props.history.push('/course/' + courseID)
                }

            } else if (module.type === "PDF") {
                if (typeof (module.pdf) === 'undefined') {
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
                            "urlFile": module.fileName
                        })
                    })

                    const data = await res.json()

                    if (data.message === "unauthorized") {
                        props.history.push('dashboard');
                    } else {
                        setDialogText("Successfully Edited PDF module")
                        handleOpenDialog()
                        props.history.push('/course/' + courseID)
                    }
                }
                else {
                    const pdfTypePath = module.pdf.name.split('.')
                    // Grabbing the actual filename minus extension so that we can validate alphanumeric inputs
                    var val = pdfTypePath[pdfTypePath.length - 2];
                    var RegEx = /[^0-9a-z]/i;
                    var isValid = !(RegEx.test(val));

                    // Input contains non-alphanumeric values so we must alert the user to rename the file 
                    if (isValid === false) {
                        setDialogText('Invalid file type. Please upload a PDF for which name is alphanumeric and has no spaces.')
                        handleOpenDialog()
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
                            "urlFile": `/` + courseID + `/moduleData/${module.pdf.name}`
                        })
                    })
                    const data = await res.json()
                    if (data.message === "unauthorized") {
                        props.history.push('dashboard');
                    } else if (data.message === undefined) {
                        const res = await fetch(config.server_url + config.paths.moduleFileUpload + "?token=" + token + "&courseID=" + courseID + "&imageName=" + module.pdf.name, {
                            method: 'POST',
                            body: newFile
                        })
                        const data2 = await res.json()

                        if (data2.message === "unauthorized") {
                            props.history.push('dashboard');
                        } else if (data2.status === 'Success') {
                            setDialogText("Successfully Edited PDF module")
                            handleOpenDialog()
                            props.history.push('/course/' + courseID)
                        } //else need to do something, not sure what rn
                    } else { // this is to check if there are errors not being addressed already
                        console.log(data)
                    }
                }
            } else if (module.type === "File") {
                if (typeof (module.file) === 'undefined') {
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
                            "urlFile": module.fileName
                        })
                    })

                    const data = await res.json()

                    if (data.message === "unauthorized") {
                        props.history.push('dashboard');
                    } else {
                        setDialogText("Successfully Edited File module")
                        handleOpenDialog()
                        props.history.push('/course/' + courseID)
                    }
                } else {

                    const fileTypePath = module.file.name.split('.')

                    // Grabbing the actual filename minus extension so that we can validate alphanumeric inputs
                    val = fileTypePath[fileTypePath.length - 2];
                    var RegEx = /[^0-9a-z]/i;
                    isValid = !(RegEx.test(val));

                    // Input contains non-alphanumeric values so we must alert the user to rename the file 
                    if (isValid === false) {
                        setDialogText('Invalid file type. Please upload a file for which name is alphanumeric and has no spaces.')
                        handleOpenDialog()
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
                            "urlFile": `/` + courseID + `/moduleData/${module.file.name}`
                        })
                    })
                    const data = await res.json()
                    if (data.message === "unauthorized") {
                        props.history.push('dashboard');
                    } else if (data.message === undefined) {
                        const res = await fetch(config.server_url + config.paths.moduleFileUpload + "?token=" + token + "&courseID=" + courseID + "&imageName=" + module.file.name, {
                            method: 'POST',
                            body: newFile
                        })
                        const data2 = await res.json()

                        if (data2.message === "unauthorized") {
                            props.history.push('dashboard');
                        } else if (data2.status === 'Success') {
                            setDialogText("Successfully Edited File module")
                            handleOpenDialog()
                            props.history.push('/course/' + courseID)
                        } //else need to do something, not sure what rn
                    } else { // this is to check if there are errors not being addressed already
                        console.log(data)
                    }
                }
            } else if (module.type === "Video") {
                if (typeof (module.video) === 'undefined') {
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
                            "urlVideo": module.videoName
                        })
                    })

                    const data = await res.json()

                    if (data.message === "unauthorized") {
                        props.history.push('dashboard');
                    } else {
                        setDialogText("Successfully Edited Video module")
                        handleOpenDialog()
                        props.history.push('/course/' + courseID)
                    }
                } else {

                    const videoTypePath = module.video.name.split('.')
                    val = videoTypePath[videoTypePath.length - 2];
                    var RegEx = /[^0-9a-z]/i;
                    isValid = !(RegEx.test(val));

                    // Input contains non-alphanumeric values so we must alert the user to rename the file 
                    if (isValid === false) {
                        setDialogText("Invalid file type. Please upload a video for which name is alphanumeric and has no spaces.")
                        handleOpenDialog()
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
                            "urlVideo": `/` + courseID + `/moduleData/${module.video.name}`,
                        })

                    })

                    const data = await res.json()
                    if (data.message === "unauthorized") {
                        props.history.push('dashboard');
                    } else if (data.message === undefined) {
                        const res = await fetch(config.server_url + config.paths.moduleFileUpload + "?token=" + token + "&courseID=" + courseID + "&imageName=" + module.video.name, {
                            method: 'POST',
                            body: newVideo
                        })
                        const data2 = await res.json()

                        if (data2.message === "unauthorized") {
                            props.history.push('dashboard');
                        } else if (data2.status === 'Success') {
                            setCourseID("Successfully Edited video module")
                            handleOpenDialog()
                            props.history.push('/course/' + courseID)
                        } //else need to do something, not sure what rn
                    } else { // this is to check if there are errors not being addressed already
                        console.log(data)
                    }
                }
            } else {
                res = await fetch(config.server_url + config.paths.editModule, {

                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ 'token': token, 'moduleID': props.location.moduleIndex, 'courseID': courseID, 'title': module.title, 'description': module.description, 'type': module.type })
                })

                const data = await res.json()

                if (data.newToken !== undefined)
                    localStorage.setItem("token", data.newToken)


                if (data.message === "unauthorized") {
                    props.history.push('dashboard');
                } else if (data.message === undefined) {
                    setCourseID('Successfully Edited Text Module')
                    handleOpenDialog()
                    props.history.push('/course/' + courseID)
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
                                <Typography className={classes.Title} variant="h5">{title === "" ? 'New Module' : title}</Typography>
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
                                        name="Module Type"
                                        inputProps={{
                                            id: 'category-native-required',
                                        }}
                                        onChange={e => setType(e.target.value)}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={"Quiz"}>Quiz</option>
                                        <option value={"Video"}>Video</option>
                                        <option value={"PDF"}>PDF</option>
                                        <option value={"File"}>File</option>
                                        <option value={"Text"}>Text</option>
                                    </Select>
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>

                                {type === 'PDF' && <PDFCreator setPDF={setPDF} pdf={pdf} />}
                                {type === 'Video' && <VideoCreator setVideo={setVideo} video={video} />}
                                {type === 'File' && <FileCreator setFile={setFile} file={file} />}
                                {type === 'Quiz' && <QuizCreator gradeToPass={gradeToPass} setGradeToPass={setGradeToPass} />}

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
            <DialogComponent
                open={openDialog}
                text={dialogText}
                onClose={handleCloseDialog}
                buttons={[
                    { text: "Ok", style: dialogClasses.dialogButton1, onClick: handleCloseDialog }
                ]}
            />
        </div>
    )
}

export default ModuleEditor;
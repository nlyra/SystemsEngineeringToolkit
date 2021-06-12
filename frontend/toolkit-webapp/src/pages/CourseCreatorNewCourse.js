import React, { useState, useEffect } from 'react'
import { Button, Container, TextField, Typography, Box, Select, InputLabel, FormHelperText, Paper } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Chip from '@material-ui/core/Chip';
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import courseStyles from '../styles/courseCreatorStyle'
import '../css/Login.css';

function NewCourse(props) {

    const classes = courseStyles()

    const [courseTitle, setCourseTitle] = useState('')
    const [categories, setCategories] = useState([])
    const [description, setDescription] = useState('')
    const [image, setImage] = useState()
    const [dialogData, setDialogData] = React.useState([]);
    const filter = createFilterOptions();

    const onSubmit = (e) => {
        e.preventDefault()
        if (!courseTitle || !categories || !description) {
            alert('Please enter all required fields')
            return
        }
        console.log("categories on submit: " + categories)
        onFinish({ courseTitle, categories, description })
    }

    const onUpload = (e) => {
        alert('feature undefined')
        return
    }

    const onFinish = async (creds) => {

        const token = localStorage.getItem("token");

        if (image !== undefined) { //if there is an image

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
                    "category": creds.categories,
                    "description": creds.description,
                    "urlImage": `http://localhost:4000/${image.name}`
                })
            })

            // Check if there are any new categories that need to be added to the DB categories collection.
            for (const newTag of categories) {
                if (dialogData.find(c => c.label === newTag.label)) continue;

                const res = await fetch(config.server_url + config.paths.addCategories, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        "token": token,
                        "label": newTag.label
                    }),
                })
            }

            const data = await res.json()
            if (data.message === undefined) {
                const res = await fetch(config.server_url + config.paths.fileUpload + "?token=" + token + "&courseID=" + data._id + "&imageName=" + image.name, {
                    method: 'POST',
                    body: imageData
                })
                const data2 = await res.json()
                console.log(data2)

                if (data2.status == 'Success') {
                    alert("Successfully created course!")
                    props.history.push('/dashboard')// needs to be changed to course manager
                } //else need to do something, not sure what rn
            }
            else { // this is to check if there are errors not being addressed already
                console.log(data)
            }

        } else {// if there is not an image

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
                    "urlImage": `http://localhost:4000/misc_files/logo.jpg`
                })
            }
            )
            const data = await res.json()
            if (data.message === undefined) {
                alert("Successfully created course!")
                props.history.push('/dashboard')// needs to be changed to course manager
            } else { // this is to check if there are errors not being addressed already
                console.log(data)
            }
        }
    }

    const onTagsChange = (event, values) => {
        // console.log(values)
        setCategories(values)
    }

    // useEffect() hook will make it so it only gets rendered once, once the page loads,
    // as opposed to after every time the form is rendered (as long as the array at the end remains empty).
    useEffect(() => {

        const categoriesCollection = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(config.server_url + config.paths.categories, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    "token": token
                })
            })

            const fetchedCategories = await res.json()
            setDialogData(fetchedCategories.categories)
        }
        categoriesCollection()

    }, []);

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
                                <Autocomplete
                                    multiple
                                    limitTags={3}
                                    className={classes.categoryContainer}
                                    id="multiple-limit-tags"
                                    options={dialogData}
                                    freeSolo
                                    onChange={onTagsChange}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip variant="outlined" label={option.label} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} variant="filled" placeholder="Categories" />
                                    )}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);

                                        if (params.inputValue !== '') {
                                            filtered.push({
                                                label: params.inputValue,
                                                inputValue: `Add "${params.inputValue}"`,
                                            });
                                        }

                                        return filtered;
                                    }}
                                    getOptionLabel={(option) => {
                                        // e.g value selected with enter, right from the input
                                        if (typeof option === 'string') {
                                            return option;
                                        }
                                        if (option.inputValue) {
                                            return option.inputValue;
                                        }
                                        return option.label;
                                    }}
                                />
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
                            <input type="file" name="picture" accept="image/*" onChange={e => setImage(e.target.files[0])} />
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
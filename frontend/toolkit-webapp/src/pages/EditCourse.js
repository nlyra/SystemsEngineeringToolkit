import React, { useState, useEffect } from 'react'
import { Button, Container, TextField, Typography, Box, Paper, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import courseStyles from '../styles/courseCreatorStyle'

function EditCourse(props) {

    const classes = courseStyles()

    const [course] = useState(props.location.course)
    const [courseTitle, setCourseTitle] = useState(props.location.course.name)
    const [categories, setCategories] = useState([])
    const [description, setDescription] = useState(props.location.course.description)
    const [skillLevel, setSkillLevel] = useState(props.location.course.skillLevel)
    const [intendedAudience, setIntendedAudience] = useState(props.location.course.intendedAudience)
    const [prerequisite, setPrerequisite] = useState(props.location.course.prerequisite)
    const [oldCourseImage] = useState(props.location.course.urlImage)
    const [currCourseImage, setCurrCourseImage] = useState(undefined)
    const [dialogData, setDialogData] = useState([]);
    const filter = createFilterOptions();

    let validImageTypes = ["PNG", "JPEG", "GIF", "TIF", "RAW", "JPG"]

    // useEffect() hook will go off as the page loads, checking for permissions and pulling in the course info needed
    useEffect(() => {

        const getAuthorization = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(config.server_url + config.paths.getIsCreator, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    "token": token
                })
            })

            const data = await res.json()
            if (data.message !== "yes") {
                props.history.push('/dashboard');
            }

        }
        
        // pull in categories specific to the course, from the db
        const getOldCats = () => {
            setCategories(props.location.course.categories.map((cat) => (cat)))
        }
        
        // pull in all categories from the db 
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
            
            // check if the user is allowed to be on this page
            const fetchedCategories = await res.json()
            if (fetchedCategories.message === "unauthorized") {
                props.history.push('dashboard');
            } else
            setDialogData(fetchedCategories.categories)
        }

        getAuthorization();
        getOldCats()
        categoriesCollection()

    }, [props]);


    // Submitted changes to edit page: update db in another function
    const onSubmit = (e) => {
        e.preventDefault()
        if (!courseTitle || !categories || !description || !intendedAudience || !prerequisite) {
            alert('Please enter all required fields')
            return
        }
        onFinish()
    }


    const onFinish = async (creds) => {

        const token = localStorage.getItem("token");

        // Call backend to update the course info with the changes the user made
        const res = await fetch(config.server_url + config.paths.updateCourseInfo, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                'token': token,
                'courseID': course._id,
                "name": courseTitle,
                "categories": categories,
                "description": description,
                "skillLevel": skillLevel,
                "intendedAudience": intendedAudience,
                "prerequisite": prerequisite,
            })
        })

        const data = await res.json()

        if (data.message === "unauthorized")
            props.history.push('/dashboard');
        else {

            // No new image assigned to course so only refresh to show other updates
            if (currCourseImage === undefined) {
                props.history.push('/course/' + course._id)
                return
            }

            // We have a new image being passed in so delete old image file in the folder (within 'public')
            const res2 = await fetch(config.server_url + config.paths.removeFile, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    'token': token,
                    'courseID': course._id
                })
            })

            const data = await res2.json()

            if (data.newToken !== undefined)
                localStorage.setItem("token", data.newToken)

            const imageData = new FormData();
            imageData.append('file', currCourseImage)

            // Checking to see if the file inputted is not an actual valid image
            const imageTypePath = currCourseImage.name.split('.')
            const imageType = imageTypePath[imageTypePath.length - 1]
            const validInput = validImageTypes.includes(imageType.toUpperCase());

            // If it isn't, return and allow user to input valid image
            if (!validInput) {
                alert('Invalid file type. Please upload an image with a proper image extension')
                return
            }

            // Check that the input given is alphanumeric to avoid the possibility of commands being 
            // passed in to the backend
            var val = imageTypePath[imageTypePath.length - 2];
            var RegEx = /[^0-9a-z]/i;
            var isValid = !(RegEx.test(val));

            if (isValid === false) {
                alert('Invalid file type. Please upload an image for which name is alphanumeric.')
                return
            }

            // If the image has been changed, we must update the image file in the backend
            if (currCourseImage.name !== oldCourseImage.name) {

                if (data.message === undefined) {
                    const res = await fetch(config.server_url + config.paths.fileUpload + "?token=" + token + "&courseID=" + course._id + "&imageName=" + currCourseImage.name, {
                        method: 'POST',
                        body: imageData
                    })
                    const data2 = await res.json()

                    if (data2.message === "unauthorized") {
                        props.history.push('dashboard');
                    } else if (data2.status === 'Success') {
                        alert("Edits have been successfully made")
                        props.history.push('/course/' + course._id) 
                    } 
                }
                else { 
                    // this is to check if there are errors not being addressed already
                    console.log(data)
                }
            }
            else {

                const res = await fetch(config.server_url + config.paths.updateCourseImage, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        'token': token,
                        'courseID': course._id,
                        "imageLink": currCourseImage,
                    })

                })

                const data2 = await res.json()

                if (data2.message === "unauthorized") {
                    props.history.push('dashboard');
                } else if (data2.status === 'Success') {
                    alert("Edits have been successfully made")
                    props.history.push('/course/' + course._id)
                } 
            }
        }
    }

    // Go back to course page
    const onCancel = () => {
        props.history.push('/course/' + course._id)
    }

    const onTagsChange = (event, values) => {
        setCategories(values)
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
                                <Typography className={classes.Title} variant="h5">{courseTitle === "" ? 'New Course' : courseTitle}</Typography>
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
                                    fullWidth
                                    className={classes.categoryContainer}
                                    id="multiple-limit-tags"
                                    options={dialogData}
                                    freeSolo
                                    value={categories}
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
                                        // e.g value selected right from the input
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

                                <TextField
                                    size='small'
                                    variant="filled"
                                    label='Intended Audience'
                                    type="intendedAudience"
                                    value={intendedAudience}
                                    onChange={e => setIntendedAudience(e.target.value)}
                                    margin="normal"
                                    required={true}
                                    fullWidth
                                />

                                <TextField
                                    size='small'
                                    variant="filled"
                                    label='Pre Requisite'
                                    type="prerequisite"
                                    value={prerequisite}
                                    onChange={e => setPrerequisite(e.target.value)}
                                    margin="normal"
                                    required={true}
                                    fullWidth
                                />

                                <FormControl variant="outlined" className={classes.skillSelector}>
                                    <InputLabel htmlFor="grouped-native-select">Skill Level</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        defaultValue={skillLevel}
                                        onChange={(e) => setSkillLevel(e.target.value)}
                                        label="Skill Label"
                                    >
                                        <MenuItem value={"Easy"}>Easy</MenuItem>
                                        <MenuItem value={"Medium"}>Medium</MenuItem>
                                        <MenuItem value={"Hard"}>Hard</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <input style={{ marginLeft: '4vw' }} type="file" name="picture" accept="image/*" className={classes.currCourseImageStyle} onChange={e => setCurrCourseImage(e.target.files[0])} />
                            <Button type='submit' className={classes.button4} color="secondary" size="medium" variant="contained" startIcon={<ClearIcon />} onClick={onCancel}>
                                Cancel
                            </Button>
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

export default EditCourse;
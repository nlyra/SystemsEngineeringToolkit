import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Container, TextField, Typography, Box, Select, InputLabel, FormHelperText, Paper } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Chip from '@material-ui/core/Chip';
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import courseStyles from '../styles/courseStyle'
import FreeSoloDialog from '../components/FreeSoloDialog'
import '../css/Login.css';

function NewCourse(props) {

    const classes = courseStyles()

    const [courseTitle, setCourseTitle] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState()

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

    const [chipData, setChipData] = React.useState([]);
    const [dialogData, setDialogData] = React.useState([]);
    const filter = createFilterOptions();

    // This will make it so it only gets rendered once once the page loads,
    // as opposed to after every time the form is rendered.
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

    const handleChipDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key))
    };

    const [value, setValue] = React.useState(null);
    const [open, toggleOpen] = React.useState(false);

    const handleClose = () => {
        setDialogValue({
            label: '',
        });

        toggleOpen(false);
    };

    const [dialogValue, setDialogValue] = React.useState({
        label: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setValue({
            label: dialogValue.label,
        });

        handleClose();
    };

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

                                {/* <FormControl required className={classes.formControl} fullWidth={true}>
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
                                </FormControl> */}
                                {/* <React.Fragment>
                                    <Autocomplete>

                                    </Autocomplete>
                                </React.Fragment> */}
                                {/* <FreeSoloDialog 
                                    dialogData={dialogData}
                                /> */}
                                {/* // <Paper component="ul" className={classes.chipContainer}>
                                //     {chipData.map((data) => {
                                //         return (
                                //             <li key={data.key}>
                                //                 <Chip 
                                //                     label={data.label}
                                //                     className={classes.chip}
                                //                     onDelete={handleChipDelete(data)}
                                //                 />
                                //             </li>
                                //         )
                                //     })}
                                // </Paper> */}
                                <Autocomplete
                                    multiple
                                    limitTags={3}
                                    className={classes.categoryContainer}
                                    id="multiple-limit-tags"
                                    options={dialogData}
                                    freeSolo
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
                                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                    <form onSubmit={handleSubmit}>
                                        <DialogTitle id="form-dialog-title">Add a new film</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Did you miss any film in our list? Please, add it!
                                            </DialogContentText>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="name"
                                                value={dialogValue.title}
                                                onChange={(event) => setDialogValue({ ...dialogValue, title: event.target.value })}
                                                label="title"
                                                type="text"
                                            />
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                value={dialogValue.year}
                                                onChange={(event) => setDialogValue({ ...dialogValue, year: event.target.value })}
                                                label="year"
                                                type="number"
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button type="submit" color="primary">
                                                Add
                                            </Button>
                                        </DialogActions>
                                    </form>
                                </Dialog>
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
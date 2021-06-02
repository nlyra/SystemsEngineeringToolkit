import React, { useState } from 'react'
import { Button, FormControl, Container, Grid, NativeSelect, TextField, Typography, Box, Select, InputLabel, FormHelperText, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import config from '../config.json'
import TopNavBar from '../components/TopNavBar'
import moduleStyles from '../styles/moduleStyle'
import '../css/Login.css';
// import NoteCard from '../components/NoteCard'
// import Draggable from 'react-draggable'
// import { Notes, SettingsOverscanOutlined } from '@material-ui/icons';
import { Card, CardHeader, CardContent, IconButton} from '@material-ui/core'
import { DeleteOutlined, ArrowUpwardOutlined, ArrowDownwardOutlined } from '@material-ui/icons'


function NewModule(props) {

    
    const [moduleName, setModuleName] = useState('')
    const [moduleType, setModuleType] = useState('')
    const [description, setDescription] = useState('')
    const classes = moduleStyles()
    const [open, setOpen] = React.useState(false);
    var cards = JSON.parse(localStorage.getItem('myCards'))



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        localStorage.clear();
    }

    const handleSubmit = () => {
        setOpen(false);

        var previousCards = JSON.parse(localStorage.getItem('myCards'));
        if(previousCards == null) previousCards = [];

        localStorage.setItem("newCard", description);

        previousCards.push(description)        
        setDescription('')
        localStorage.setItem('myCards', JSON.stringify(previousCards))
    }

    const handleChange = (event) => {
        setModuleType(event.target.category);
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!moduleName || !moduleType) {
            alert('Please enter all required fields')
            return
        }
        onFinish({ moduleName, moduleType,})
        setModuleName('')
        setModuleType('')
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
            body: JSON.stringify({ "modules": [], "Module Name": creds.moduleName, "category": creds.category, "description": creds.description, "url": 'http://localhost:4000/java.jpg'})
        })

        const data = await res.json()

        if (data.message === undefined) {
            props.history.push('dashboard')
        }
        else { // this is to check if there are errors not being addressed already
            console.log(data)
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
                            <Typography className={classes.Title} variant="h5">Module Creator</Typography>
                        </Box>
                        <div className={classes.TextBox}>
                            <TextField color='primary'
                                size='small'
                                variant="filled"
                                label='Module Name'
                                type="Module Name"
                                value={moduleName}
                                onChange={e => setModuleName(e.target.value)}
                                margin="normal"
                                required={true}
                                fullWidth
                            />

                            <FormControl required className={classes.formControl} fullWidth={true}>
                                <InputLabel htmlFor="category-native-required">Category</InputLabel>
                                <Select
                                    native
                                    value={moduleType}
                                    onChange={handleChange}
                                    name="Module Tipe"
                                    inputProps={{
                                        id: 'moduleType-native-required',
                                    }}
                                    onChange={e => setModuleType(e.target.value)}
                                >
                                    <option aria-label="None" value="" />
                                    <option value={"Test"}>test</option>
                                    <option value={"Data"}>Data</option>
                                    <option value={"Other"}>Other</option>
                                </Select>
                                <FormHelperText>Required</FormHelperText>
                            </FormControl>
                            <Grid container spacing={2}>
                                {cards?.map(function(card, index){
                                    return <Grid item xs={12}>
                                        <Card>
                                            <CardHeader
                                                action={
                                                    <IconButton onClick={() => console.log(index)}>
                                                        <DeleteOutlined/>
                                                    </IconButton>
                                                }
                                            title= {cards[index]}
                                            />
                                        </Card>
                                    </Grid>
                                })}
                            </Grid>

                        </div>
                        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                            Add additional cards
                        </Button>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                            <DialogContent>
                            <DialogContentText>
                                Enter information
                            </DialogContentText>
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
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button type='submit' className={classes.button3} size="medium" variant="contained" startIcon={<CloudUploadIcon/>} onClick={onUpload}>
                                Add File
                            </Button>
                            <Button onClick={handleSubmit} color="primary">
                                Submit
                            </Button>
                            </DialogActions>
                        </Dialog>


                        <Button type='submit' className={classes.button4} size="medium" variant="contained" startIcon={<ArrowForwardIcon/>} onClick={onSubmit}>
                            Submit
                        </Button>
                        <Button onClick={handleCancel} color="primary">
                            Cancel
                        </Button>
                        </Paper>
                    </form>
                </div>
            </Container>
        </div>
    )
}

export default NewModule;
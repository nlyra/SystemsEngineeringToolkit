import React, { useState } from 'react'
import { Button, Container, TextField, makeStyles, Typography, Paper, Box } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import config from '../config.json'
import resetPassStyle from '../styles/registerStyle'
// import '../css/Registration.css';
import TopNavBar from '../components/TopNavBar'
import videoSource from '../img/PEOSTRI.mp4'
import dialogStyles from '../styles/dialogStyle'
import DialogComponent from '../components/DialogComponent'

const ForgotPassword = (props) => {
    
    const [email, setEmail] = useState('')
    const [dialogText, setDialogText] = useState('')
    const [openDialog, setOpenDialog] = useState(false);
    const dialogClasses = dialogStyles()
    const classes = resetPassStyle()

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const onLogin = (e) => {
        props.history.push('login');
    }

    const resetLink = async (e) => {
        e.preventDefault()

        if(email == '')
        {
            setDialogText("Please enter an email in the text box.")
            handleOpenDialog()
            //alert('Please enter an email in the text box.')
            return
        }

        const res = await fetch(config.server_url + config.paths.forgotPassword, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "email": email })
        })

        const data = await res.json()
        setDialogText("An email has been sent to the email listed, if registered.")
        handleOpenDialog()
        //alert('An email has been sent to the email listed, if registered.')
        setEmail('')

    }

    return (
        <>
            <TopNavBar hideComponents={true}/>
            <div className={classes.darkOverlay}>
                <video className={classes.video} autoPlay loop muted playsInline>
                    <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
                </video>
            </div>
            <div className={classes.container}>
                <div className={classes.block} style={{ minWidth: '400px' }}>
                    <form autoComplete="off" >
                        <Paper className={classes.paper} elevation={5} square={false}>
                            <Avatar className={classes.avatar}>
                                <PermIdentityOutlinedIcon />
                            </Avatar>
                            <Box m={2} pt={2}>
                                <Typography className={classes.Title} variant="h5">Forgot Password</Typography>
                            </Box>
                            <TextField color='primary'
                                size='small'
                                variant="filled"
                                label='Email'
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                margin="normal"
                                required={true}
                                fullWidth
                                style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                            />

                            <Button type='submit' fullWidth className={classes.button} size="medium" variant="contained" onClick={resetLink}>
                                Send Confirmation Email
                            </Button>
                            <Button type='submit' className={classes.button2} size="small" onClick={onLogin}>
                                Return to Login here
                            </Button>
                        </Paper>
                    </form>
                </div>
                <DialogComponent
                    open={openDialog}
                    text={dialogText}
                    onClose={handleCloseDialog}
                    buttons={[
                        { text: "Ok", style: dialogClasses.dialogButton1, onClick: handleCloseDialog }
                    ]}
                />
            </div>
        </>
    )
}

export default ForgotPassword;

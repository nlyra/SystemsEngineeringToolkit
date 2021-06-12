import React, { useState, useEffect } from 'react'
import { Button, Container, TextField, Typography, Paper, Box } from '@material-ui/core'
import config from '../config.json'
import loginStyles from '../styles/loginStyle'
import TopNavBar from '../components/TopNavBar'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import videoSource from '../img/PEOSTRI.mp4'
import jwt_decode from "jwt-decode";

function ResetPassword(props) {

    const [password, setPassword] = useState('')
    const [passwordCopy, setPasswordCopy] = useState('')
    // const [resetToken, setResetToken] = useState('')

    const classes = loginStyles()

    useEffect(() => {
        const pathname = window.location.pathname.split('/') //returns the current path
        const resetToken = pathname[pathname.length - 1]
        
        let res = undefined
        checkCreds(resetToken)

    }, []);

    const checkCreds = async (resetToken) => {

        let res = undefined

        res = await fetch(config.server_url + config.paths.checkResetCreds, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({"resetToken": resetToken})

        })

        const data = await res.json()
        
        if(data.message === 'credentials disapproved')
        {
            alert(data.message)
            alert('Your token may have expired. Please input your information again for a follow-up email.')
            props.history.push('../forgot');
        }

    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!password || !passwordCopy) {
            alert('Please fill in both blanks')
            return
        }

        if(password !== passwordCopy)
        {
            alert('Passwords must match!')
            return
        }

        onResetPass({password})

    }

    const onResetPass = async (creds) => {

        const pathname = window.location.pathname.split('/') //returns the current path
        const resetToken = pathname[pathname.length - 1]
        
        const res = await fetch(config.server_url + config.paths.resetPassApproved, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "resetToken": resetToken, "password": creds.password })
        })
        
        // alert('help')
        const data = await res.json()

        if (data.message === "Success!") {
            alert('Password has been changed!')
            props.history.push('../../login')
        }
        // else if(data.message === "Old Password")
        // {
        //     alert("Please choose a password you haven't used before!")
        //     return
        // }
        else
        {
            alert('Something went wrong! Try inputting your new password again')
            return
        }
       
    }

    const returnToLogin = (e) => {
        props.history.push('../login');
    }

    return (
        <div style={{height:'100vh', width:'100vw'}}>
            <TopNavBar hideComponents={true}/>
            <div className={classes.darkOverlay}>
                <video className={classes.video} autoPlay loop muted playsInline>
                    <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
                </video>
            </div>
            <div className={classes.container}>
                <div className={classes.block}>
                    <form autoComplete="off" onSubmit={onSubmit}>
                        <Paper className={classes.paper} elevation={5} square={false}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                            <Box m={2} pt={2} style={{justifyContent: 'center'}}>
                                <Typography className={classes.Title} variant="h5">Reset Your Password</Typography>
                            </Box>
                            <div className={classes.TextBox}>
                                <TextField color='primary'
                                    size='small'
                                    variant="filled"
                                    label='New Password'
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    margin="normal"
                                    required={true}
                                    fullWidth
                                    style={{backgroundColor: "rgba(255,255,255,0.8)"}}
                                />

                                <TextField
                                    size='small'
                                    variant="filled"
                                    label='Confirm Password'
                                    type="password"
                                    value={passwordCopy}
                                    onChange={e => setPasswordCopy(e.target.value)}
                                    margin="normal"
                                    required={true}
                                    fullWidth
                                    style={{backgroundColor: "rgba(255,255,255,0.8)"}}
                                />

                            </div>
                            <Button fullWidth type='submit' className={classes.resetPassButton} size="medium" variant="contained" >
                                Reset Password
                            </Button>
                            <br></br>
                            <Button type='submit' className={classes.button2} size="small" onClick={returnToLogin}>
                               Remembered it? Click here 
                            </Button>
                        </Paper>
                    </form>
                </div>
            </div>
        </div>
        
    )
}

export default ResetPassword;

import React, { useState } from 'react'
import { Button, Container, TextField, makeStyles, Typography, Paper, Box } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import config from '../config.json'
import resetPassStyle from '../styles/registerStyle'
// import '../css/Registration.css';
import TopNavBar from '../components/TopNavBar'
import videoSource from '../img/PEOSTRI.mp4'

const ForgotPassword = (props) => {
    
    const [email, setEmail] = useState('')
    const classes = resetPassStyle()

    const onLogin = (e) => {
        props.history.push('login');
    }

    const resetLink = async (e) => {
        e.preventDefault()

        const res = await fetch(config.server_url + config.paths.forgotPassword, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "email": email })
        })

        const data = await res.json()
        alert('An email has been sent to the email listed, if registered.')

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
            </div>
        </>
    )
}

export default ForgotPassword;

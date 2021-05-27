import React, { useState } from 'react'
import { Button, Container, TextField, Typography, Paper, Box } from '@material-ui/core'
import config from '../config.json'
import useStyles from './styles'
import TopNavBar from '../components/topNavBar'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import '../css/Login.css';
import videoSource from '../img/PEOSTRI.mp4'


function Login(props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const classes = useStyles()

    const onRegister = (e) => {
        props.history.push('registration');
    }
    const onForgot = (e) => {
        props.history.push('forgot');
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!email || !password) {
            alert('Please enter Email and Password')
            return
        }
        onLogin({ email, password })
        setEmail('')
        setPassword('')
    }

    const onLogin = async (creds) => {
    const res = await fetch(config.server_url + config.paths.login, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
            body: JSON.stringify({ "email": creds.email, "password": creds.password })
        })

        const data = await res.json()

        if (data.message === undefined) {
            localStorage.setItem("token", data.token);
            props.history.push('dashboard')

        } else if (data.message === "wrong email or password") {
            alert("Wrong email or password, please try again.");
        } else { // this is to check if there are errors not being addressed already
            console.log(data)
        }

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
                                <Typography className={classes.Title} variant="h5">Sign In</Typography>
                            </Box>
                            <div className={classes.TextBox}>
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
                                    style={{backgroundColor: "rgba(255,255,255,0.8)"}}
                                />

                                <TextField
                                    size='small'
                                    variant="filled"
                                    label='Password'
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    margin="normal"
                                    required={true}
                                    fullWidth
                                    style={{backgroundColor: "rgba(255,255,255,0.8)"}}
                                />

                            </div>
                            <Button fullWidth type='submit' className={classes.button} size="medium" variant="contained" >
                                Sign In
                            </Button>
                            <br></br>
                            <Button type='submit' className={classes.button2} size="small" onClick={onRegister}>
                                Register
                            </Button>
                            <Button type='submit' className={classes.button2} size="small" onClick={onForgot}>
                                Forgot Password?
                            </Button>
                        </Paper>
                    </form>
                </div>
            </div>
        </div>
        
    )
}

export default Login;
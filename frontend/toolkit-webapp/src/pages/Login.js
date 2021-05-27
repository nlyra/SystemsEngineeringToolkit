import React, { useState } from 'react'
import { Button, Container, TextField, Typography, Paper, Box } from '@material-ui/core'
import config from '../config.json'
import loginStyles from '../styles/loginStyle'
import '../css/Login.css';

function Login(props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const classes = loginStyles()

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
        <Container className={classes.container} maxWidth="xs">
            <div className={classes.block}>
                <form autoComplete="off" onSubmit={onSubmit}>
                    <Paper className={classes.paper} elevation={5} square={false}>
                        <Box m={2} pt={2}>
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
                            />

                        </div>
                        <Button type='submit' className={classes.button} size="medium" variant="contained" >
                            Sign In
                        </Button>
                        <br></br>
                        <Button type='submit' className={classes.button2} size="small" variant="contained" onClick={onRegister}>
                            Register
                        </Button>
                        <Button type='submit' className={classes.button2} size="small" variant="contained" onClick={onForgot}>
                            Forgot Password?
                        </Button>
                    </Paper>
                </form>
            </div>
        </Container>
    )
}

export default Login;
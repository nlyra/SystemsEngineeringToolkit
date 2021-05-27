import React, { useState } from 'react'
import { Button, Container, TextField, makeStyles, Typography, Paper, Box } from '@material-ui/core'
import config from '../config.json'
import registerStyles from '../styles/registerStyle'
// import '../css/Registration.css';

function Registration(props) {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCopy, setPasswordCopy] = useState('')

    const classes = registerStyles()

    const onLogin = (e) => {
        props.history.push('login');
    }
    // const onForgot = (e) => {
    //     props.history.push('forgot');
    // }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!firstName || !lastName || !email || !password) {
            alert('Please enter all fields')
            return
        }
        if (password != passwordCopy) {
            alert('Passwords do not match!')
            return
        }
        onRegistration({ firstName, lastName, email, password })
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setPasswordCopy('')
    }

    const onRegistration = async (creds) => {
        console.log(creds);
        const res = await fetch(config.server_url + config.paths.registration, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "first_name": creds.firstName, "last_name": creds.lastName, "email": creds.email, "password": creds.password, "password_copy": creds.passwordCopy })
        })

        const data = await res.json()

        if (data.message == "added user") {
            alert("Success, user Created!!");
            props.history.push('login')

        } else if (data.message === "email already connected to an account") {
            alert("email already connected to an account, please try again.");
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
                            <Typography className={classes.Title} variant="h5">Register</Typography>
                        </Box>
                        <div className={classes.TextBox}>
                            <TextField color='primary'
                                size='small'
                                variant="filled"
                                label='First Name'
                                type="name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                margin="normal"
                                required={true}
                                fullWidth
                            />

                            <TextField color='primary'
                                size='small'
                                variant="filled"
                                label='Last Name'
                                type="name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                margin="normal"
                                required={true}
                                fullWidth
                            />

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

                            <TextField
                                size='small'
                                variant="filled"
                                label='Repeat Password'
                                type="password"
                                value={passwordCopy}
                                onChange={e => setPasswordCopy(e.target.value)}
                                margin="normal"
                                required={true}
                                fullWidth
                            />

                        </div>
                        <Button type='submit' className={classes.button} size="medium" variant="contained" onClick={onRegistration}>
                            Register
                        </Button>
                        <br></br>
                        <Button type='submit' className={classes.button2} size="small" variant="contained" onClick={onLogin}>
                            Already Registered?
                        </Button>
                    </Paper>
                </form>
            </div>
        </Container>
    )
}

export default Registration;
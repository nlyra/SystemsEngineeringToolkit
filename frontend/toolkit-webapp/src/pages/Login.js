import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import purple from '@material-ui/core/colors/purple'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import config from '../config.json'
import '../css/Login.css';

const useStyles = makeStyles((theme) => ({

    Title:
    {
        fontWeight: "bold"
    },
    container: {
        height: "100%",
    },

    paper:
    {
        padding: '5px 40px 5px 40px',
        borderRadius: 15,
        marginTop: theme.spacing(25),
    },

    block:
    {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    button:
    {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
    },

    button2:
    {
        fontSize: 10,
        background: 'linear-gradient(45deg, #90a4ae 10%, #e0e0e0 90%)',
        marginBottom: theme.spacing(2),
        marginLeft:  theme.spacing(2)
    }

}))

function Login(props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const classes = useStyles()
    const color = purple['A200']
    
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
        console.log(creds);
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

        }else if (data.message === "wrong email or password"){
            alert("Wrong email or password, please try again.");
        }else{ // this is to check if there are errors not being addressed already
            console.log(data)
        }

    }

    return (
        <Container className = {classes.container} maxWidth = "xs">
            <div className = {classes.block}>
                <form autoComplete = "off" onSubmit={onSubmit}>
                    <Paper className = {classes.paper} elevation = {5} square = {false}>
                        <Box m={2} pt={2}>
                            <Typography className = {classes.Title} variant = "h5">Sign In</Typography>
                        </Box>
                        <div className = {classes.TextBox}>
                            <TextField color = 'primary'
                            size = 'small' 
                            variant = "filled"
                            label = 'Email'
                            type = "email"
                            value = {email}
                            onChange={e => setEmail(e.target.value)}
                            margin = "normal"
                            required = {true}
                            fullWidth
                            />

                            <TextField 
                            size = 'small' 
                            variant = "filled"
                            label = 'Password'
                            type = "password"
                            value = {password}
                            onChange={e => setPassword(e.target.value)}
                            margin = "normal"
                            required = {true}
                            fullWidth
                            />

                        </div>
                        <Button type='submit' className = {classes.button} size = "medium" variant = "contained" >
                            Sign In
                        </Button>
                        <br></br>
                        <Button type='submit' className = {classes.button2} size = "small" variant = "contained" onClick={onRegister}>
                            Register
                        </Button>
                        <Button type='submit' className = {classes.button2} size = "small" variant = "contained" onClick={onForgot}>
                            Forgot Password?
                        </Button>
                    </Paper>
                </form>
            </div>
        </Container>
    )
}

export default Login;
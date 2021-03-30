import React, { useState } from 'react'
import '../css/Login.css';
import '../css/App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../config.json'

function Login(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLogged, setIsLogged] = useState(false)

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
            body: JSON.stringify({ "email": email, "password": password })
        })

        const data = await res.json()
        if (data.message === "success") {
            props.history.push('dashboard')

            // Still needs to create something to handle authentication (token)
        }

        // Still needs to create something to handle failure

    }


    return (
        <div>
            <form className='login-form' onSubmit={onSubmit} >
                <div className="block">
                    <div className="title">
                        <h3>Login</h3>
                    </div>

                    <div className="loginContent">
                        <label htmlFor="email">Email: </label><br></br>
                        <input value={email} type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="loginContent">
                        <label htmlFor="password">Password: </label><br></br>
                        <input value={password} type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div className="loginButton">
                        {/* Testing to see if username can be accessed naturally */}
                        <Button type='submit' variant="danger" size="md" className='btn'>
                            Login
                    </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login;
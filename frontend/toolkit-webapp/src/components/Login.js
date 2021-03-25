import React, {useState} from 'react'
import '../css/Login.css';
import '../css/App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login()
{
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')


    return (
        <form>
            <div className = "block">
                <div className= "title">
                <h3>Login</h3>
                </div>

                <div className = "loginContent">
                    <label htmlFor = "name">Name: </label><br></br>
                    <input type= "text" name= "username" onChange={e => setUsername(e.target.value)}/>
                </div>
                
                <div className = "loginContent">
                    <label htmlFor = "password">Password: </label><br></br>
                    <input type= "text" name = "password" id = "password" onChange={e => setPassword(e.target.value)}/>
                </div>

                <div className = "loginContent">
                    <label htmlFor = "email">Email: </label><br></br>
                    <input type= "text" name = "email" id = "email" onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="loginButton">
                {/* Testing to see if username can be accessed naturally */}
                <Button variant="danger" size="md" onClick={() => console.log(username)}>
                Login
                </Button>
                </div>
            </div>
        </form>
    )
}

export default Login;
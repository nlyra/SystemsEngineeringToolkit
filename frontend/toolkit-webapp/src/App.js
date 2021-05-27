import './css/App.css';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Registration from './pages/Registration'
import ForgotPassword from './pages/ForgotPassword'
import CourseCreatorNewCourse from './pages/CourseCreatorNewCourse'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import videoSource from "./img/PEOSTRI.mp4"

function App() {
  return (
        <Router>
            <Route path='/' exact component={Login} />
            <Route path='/login' component={Login} />
            <Route path='/Dashboard' component={Dashboard} />
            <Route path='/registration' component={Registration} />
            <Route path='/forgot' component={ForgotPassword} />
            <Route path = '/newCourse' component ={CourseCreatorNewCourse}/>
        </Router>
  );
}

export default App;

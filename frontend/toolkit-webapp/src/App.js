// import logo from './logo.svg';
import './css/App.css';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Registration from './pages/Registration'
import ForgotPassword from './pages/ForgotPassword'
import CourseCreatorNewCourse from './pages/CourseCreatorNewCourse'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ModuleCreator from './pages/ModuleCreator';
// import background from "./img/image0.png";
function App() {
  return (
    <Router>
      <div className="App" >
        {/* these two lines should have 'Login' not 'Dashboard' */}
        <Route path='/' exact component={Login} /> {/* should we make like a landing page, or the sanding page is login */}
        <Route path='/login' component={Login} />
        <Route path='/Dashboard' component={Dashboard} />
        <Route path='/registration' component={Registration} />
        <Route path='/forgot' component={ForgotPassword} />
        <Route path='/NewCourse' component={CourseCreatorNewCourse} />
        <Route path='/newModule' component={ModuleCreator} />
      </div>
    </Router>
  );
}

export default App;

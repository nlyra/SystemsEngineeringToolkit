import './css/App.css';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Registration from './pages/Registration'
import ForgotPassword from './pages/ForgotPassword'
import CourseCreatorNewCourse from './pages/CourseCreatorNewCourse'
import ModuleSkeleton from './pages/ModuleSkeleton'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Course from './pages/Course'
import ModuleCreator from './pages/ModuleCreator';
// import background from "./img/image0.png";
import videoSource from "./img/PEOSTRI.mp4"
import VideoModule from "./components/VideoModule"

function App() {
  return (
    <Router>
        {/* these two lines should have 'Login' not 'Dashboard' */}
        <Route path='/' exact component={Login} /> {/* should we make like a landing page, or the sanding page is login */}
        <Route path='/login' component={Login} />
        <Route path='/Dashboard' component={Dashboard} />
        <Route path='/registration' component={Registration} />
        <Route path='/forgot' component={ForgotPassword} />
        <Route path='/NewCourse' component={CourseCreatorNewCourse} />
        <Route path='/newModule' component={ModuleCreator} />
        <Route path='/course' component={Course} />
        <Route path='/VideoModule' component={VideoModule} />
     </Router>

  );
}

export default App;
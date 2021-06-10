import './css/App.css';
import { useState } from 'react';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Registration from './pages/Registration'
import ForgotPassword from './pages/ForgotPassword'
import CourseCreatorNewCourse from './pages/CourseCreatorNewCourse'
import ModuleSkeleton from './pages/ModuleSkeleton'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Course from './pages/Course'
import ModuleCreator from './pages/ModuleCreator'
import ModuleManager from './pages/ModuleManager'
// import background from "./img/image0.png";
import videoSource from "./img/PEOSTRI.mp4"
import VideoModule from "./components/VideoModule"
import MyFiles from './pages/MyFiles'
import ManageCourses from './pages/ManageCourses'
import MyCourses from './pages/MyCourses'
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { Paper } from "@material-ui/core"

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light"
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh" }}>
        <Router>
          {/* these two lines should have 'Login' not 'Dashboard' */}
          <Route path='/' exact component={Login} /> {/* should we make like a landing page, or the sanding page is login */}
          <Route path='/login' component={Login} />
          <Route path='/Dashboard' component={() => <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/registration' component={Registration} />
          <Route path='/forgot' component={ForgotPassword} />
          <Route path='/NewCourse' component={() => <CourseCreatorNewCourse darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/newModule' component={() => <ModuleCreator darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/ModuleManager' component={() => <ModuleManager darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/course' component={() => <Course darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/ManageCourses' component={() => <ManageCourses darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/MyFiles' component={() => <MyFiles darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/MyCourses' component={() => <MyCourses darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/VideoModule' component={() => <VideoModule darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Router>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
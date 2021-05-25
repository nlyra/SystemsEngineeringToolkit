// import logo from './logo.svg';
import './css/App.css';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Registration from './pages/Registration'
import ForgotPassword from './pages/ForgotPassword'
import { BrowserRouter as Router, Route } from 'react-router-dom'
<<<<<<< HEAD
import background from "./img/image0.png";
=======
// import background from "./img/image0.png";
>>>>>>> 4c83730e469981fe5dca346ff223c5ee865ac639
function App() {
  return (
    <Router>
      <div className="App" >
        {/* these two lines should have 'Login' not 'Dashboard' */}
<<<<<<< HEAD
        <Route path='/' exact component={Dashboard} /> {/* should we make like a landing page, or the sanding page is login */}
        <Route path='/login' component={Dashboard} />
=======
        <Route path='/' exact component={Login} /> {/* should we make like a landing page, or the sanding page is login */}
        <Route path='/login' component={Login} />
>>>>>>> 4c83730e469981fe5dca346ff223c5ee865ac639
        <Route path='/Dashboard' component={Dashboard} />
        <Route path='/registration' component={Registration} />
        <Route path='/forgot' component={ForgotPassword} />
      </div>
    </Router>
  );
}

export default App;

import logo from './logo.svg';
// import './css/App.css';
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <Route path='/' exact component={Login} /> {/* should we make like a landing page, or the sanding page is login */}
        <Route path='/login' component={Login} />
        <Route path='/Dashboard' component={Dashboard} />
      </div>
    </Router>
  );
}

export default App;

import './App.css'
import LandingPage from "./Pages/Landing Page/LandingPage.jsx"

import Auth from "./Pages/Authentication/Auth.jsx"
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'

function App() {  
  return (
    <>
      <Router>
          <Routes>
            <Route/>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/auth' element={<Auth/>}/>
            <Route/>
          </Routes>
      </Router>
    </>
  )
}

export default App

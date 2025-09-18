import './App.css'
import LandingPage from "./Pages/Landing Page/LandingPage"
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'

function App() {  
  return (
    <>
      <Router>
          <Routes>
            <Route/>
            <Route path='/' element={<LandingPage/>}/>
            <Route/>
          </Routes>
      </Router>
    </>
  )
}

export default App

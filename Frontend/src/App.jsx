import './App.css'
import LandingPage from "./Pages/Landing Page/LandingPage.jsx"
import Auth from "./Pages/Authentication/Auth.jsx"
import VideoCall from './Pages/Video Call/VideoCall.jsx'
import HomePage from "./Pages/Home Page/HomePage.jsx"
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import {AuthProvider} from "./Contexts/AuthContext.jsx"

function App() {  
  return (
    <>
      <Router>
          <AuthProvider>
            <Routes>            
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/home' element={<HomePage/>}/>
            <Route path='/auth' element={<Auth/>}/>
            <Route path='/:url' element={<VideoCall/>}/>
          </Routes>
          </AuthProvider>
      </Router>
    </>
  )
}

export default App

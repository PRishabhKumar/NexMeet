import './App.css'
import LandingPage from "./Pages/Landing Page/LandingPage.jsx"
import Auth from "./Pages/Authentication/Auth.jsx"
import VideoCall from './Pages/Video Call/VideoCall.jsx'
import HomePage from "./Pages/Home Page/HomePage.jsx"
import HistoryPage from './Pages/History/HistoryPage.jsx'
import EnterMeeting from "./Pages/Home Page/EnterMeeting.jsx"
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import {AuthProvider} from "./Contexts/AuthContext.jsx"
import server from './environment.js'
function App() {  
  return (
    <>
      <Router>
          <AuthProvider>
            <Routes>
            <Route path={`${server}/`} element={<LandingPage/>}/>
            <Route path={`${server}/home`} element={<HomePage/>}/>
            <Route path={`${server}/auth`} element={<Auth/>}/>
            <Route path={`${server}/joinMeeting`} element={<EnterMeeting/>}/>
            <Route path={`${server}/:url`} element={<VideoCall/>}/>   
            <Route path={`${server}/history`} element={<HistoryPage/>}/>                
          </Routes>
          </AuthProvider>
      </Router>
    </>
  )
}

export default App

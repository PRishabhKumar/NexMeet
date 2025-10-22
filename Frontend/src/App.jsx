import './App.css'
import LandingPage from "./Pages/Landing Page/LandingPage.jsx"
import Auth from "./Pages/Authentication/Auth.jsx"
import VideoCall from './Pages/Video Call/VideoCall.jsx'
import HomePage from "./Pages/Home Page/HomePage.jsx"
import HistoryPage from './Pages/History/HistoryPage.jsx'
import EnterMeeting from "./Pages/Home Page/EnterMeeting.jsx"
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
            <Route path='/joinMeeting' element={<EnterMeeting/>}/>
            <Route path='/:url' element={<VideoCall/>}/>   
            <Route path='/history' element={<HistoryPage/>}/>         
          </Routes>
          </AuthProvider>
      </Router>
    </>
  )
}

export default App

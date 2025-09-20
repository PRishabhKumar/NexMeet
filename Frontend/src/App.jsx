import './App.css'
import LandingPage from "./Pages/Landing Page/LandingPage.jsx"
import Auth from "./Pages/Authentication/Auth.jsx"
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import {AuthProvider} from "./Contexts/AuthContext.jsx"

function App() {  
  return (
    <>
      <Router>
          <AuthProvider>
            <Routes>
            
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/auth' element={<Auth/>}/>
            
          </Routes>
          </AuthProvider>
      </Router>
    </>
  )
}

export default App

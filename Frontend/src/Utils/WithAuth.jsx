import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../Contexts/AuthContext'
import { useContext, useEffect} from 'react'
function WithAuth(Component) {    
    const AuthenticationComponent = (props)=>{
        const {userData} = useContext(AuthContext)
        const router = useNavigate()
        const isAuthenticated = ()=>{
            if(userData!==null){
                return true
            }
            return false
        }
        useEffect(()=>{
            if(!isAuthenticated){
                console.log("You must be logged in to access the home page")
                router("/auth")
            }
        }, [])
        return <Component{...props}/> // is the user is authenticated, then return the wrapped components with all of its props
    }
    return AuthenticationComponent
}

export default WithAuth;
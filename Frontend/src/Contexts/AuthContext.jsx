import axios from "axios";
import httpStatus from "http-status";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment.js"

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`
});

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
        const request = await client.post("/register", {
            name,
            username,
            password,
        });

        if (request.status === httpStatus.CREATED) {
            return request.data.message || "User registered successfully !!";
        }
        } catch (err) {
        console.error(err);
        throw err;
        }
    };

    const handleLogin = async (username, password)=>{
        try{
            let request = await client.post("/login", {
                username: username,
                password: password
            })
            if(request.status === httpStatus.OK){
                localStorage.setItem("token", request.data.token)            
                setUserData({
                    username: username,
                    token: request.data.token
                })    
            }
            return request.data.message || "Login Successful !!!"
        }
        catch(err){
            throw err;
        }
    }

    const handleLogout = async()=>{
        setUserData(null) // remove all the user's data that is stored because of the login
        localStorage.removeItem("token") // remove the authentication token of this user from the local storage
        router("/") // redirect the user back to the landing page
    }

    const data = {
        userData,
        setUserData,
        handleRegister,
        handleLogin,
        handleLogout
    };

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

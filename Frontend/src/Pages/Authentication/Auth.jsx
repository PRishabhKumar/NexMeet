import "./Styles/AuthStyle.css"
import { useContext, useState } from 'react'
import VariableProximity from "./Header/VariableProximity";
import "./Styles/VariableProximity.css"
import {useRef} from 'react'
import { color } from "motion/react";
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import httpStatus from "http-status"

import Button from "./Submit Button/Button.jsx"




function Auth() {
    const containerRef = useRef(null)
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [formState, setFormState] = useState(0); // 0 is for login and 1 is for register
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleAuthnetication();
        console.log('Form submitted:', { username, name, password, formState });
    };

    const {handleRegister, handleLogin} = useContext(AuthContext)

    const handleAuthnetication = async ()=>{
        try{
            setMessage('') // clear any messages or error from before
            setError('')
            // Register
            if(formState === 1){
                let result = await handleRegister(name, username, password)
                setMessage(result || "user Registered Successfully !!")
                console.log(`Result : ${result}`)
                setError('') // this makes sure no previous error messages are shown in case of success
                setUsername('');
                setName('');
                setPassword('');

            }
            // Login
            if(formState === 0){
                let result = await handleLogin(username, password)
                console.log(`Result : ${result}`)
                setMessage("Login Successful !!!")
                setError('')
                setUsername('');
                setName('');
                setPassword('');

            }
        }
        catch(err){
            if(err && err.response && err.response.data && err.response.data.message){
                setError(err.response.data.message)
            }
            else{
                setError('Something went wrong. Please try again !!!')
            }
            setMessage(''); // this makes sure no extra success messages are displayed in case of some error 
        }
    }

    return (
        <>          
            <div className="auth-content">
                
                <div className="auth-container">

                    {(message || error) && (
                        <div className="message-container slideDownBounce">
                            {message && <p className="success-message">{message}</p>}
                            {error && <p className="error-message">{error}</p>}
                        </div>
                    )}

                    <div className="headingWrapper">
                        <div
                            ref={containerRef}
                            style={{
                                position: 'relative',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: "2rem",
                                color: "black"
                            }}
                            >
                                <VariableProximity
                                    label={'Welcome to NexMeet'}
                                    className={'variable-proximity-demo'}
                                    fromFontVariationSettings="'wght' 400, 'opsz' 9"
                                    toFontVariationSettings="'wght' 1000, 'opsz' 40"
                                    containerRef={containerRef}
                                    radius={100}
                                    falloff="linear"
                                    style={{ fontSize: '3rem', textAlign: 'center' , color: 'white'}} 
                                />
                        </div>
                    </div>

                    <div className="auth-wrapper">                    

                        {/* Toggle Buttons */}
                        <div className="auth-toggle">
                            <button 
                                onClick={() => setFormState(0)} 
                                className={`toggle-btn ${formState === 0 ? 'active' : ''}`}
                            >
                                <span>Sign In</span>
                            </button>
                            <button 
                                onClick={() => setFormState(1)} 
                                className={`toggle-btn ${formState === 1 ? 'active' : ''}`}
                            >
                                <span>Register</span>
                            </button>
                            <div className={`toggle-slider ${formState === 1 ? 'slide-right' : 'slide-left'}`}></div>
                        </div>

                        {/* Form Container */}
                        <div className="form-container">
                            <div className="form-body">
                                {/* Form Fields */}
                                <div className="form-fields">
                                    {formState === 1 ? (
                                        <div className="form-field">
                                            <div className="input-wrapper">
                                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                    <circle cx="12" cy="7" r="4"/>
                                                </svg>
                                                <input 
                                                    onChange={(event) => {
                                                        setName(event.target.value)
                                                    }} 
                                                    type="text" 
                                                    name="name" 
                                                    id="name" 
                                                    placeholder="Enter your full name"
                                                    className="form-input"
                                                    value={name}
                                                />
                                            </div>
                                        </div>
                                    ) : <></>}
                                    
                                    <div className="form-field">
                                        <div className="input-wrapper">
                                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                <polyline points="22,6 12,13 2,6"/>
                                            </svg>
                                            <input 
                                                onChange={(event) => {
                                                    setUsername(event.target.value)
                                                }} 
                                                type="text" 
                                                placeholder="Enter your username" 
                                                id="username"
                                                className="form-input"
                                                value={username}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <div className="input-wrapper">
                                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                                <circle cx="12" cy="16" r="1"/>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                            </svg>
                                            <input 
                                                onChange={(event) => {
                                                    setPassword(event.target.value)
                                                }} 
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter password" 
                                                id="password"
                                                className="form-input"
                                                value={password}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="password-toggle"
                                            >
                                                {showPassword ? (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                        <path d="m1 1 22 22"/>
                                                    </svg>
                                                ) : (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                        <circle cx="12" cy="12" r="3"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    {/* <button className="submit-btn" onClick={handleSubmit}>
                                        <span>{formState === 0 ? 'Sign In' : 'Create Account'}</span>
                                        <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <line x1="5" y1="12" x2="19" y2="12"/>
                                            <polyline points="12,5 19,12 12,19"/>
                                        </svg>
                                    </button> */}

                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "medium"}} className="submitButton">
                                            <Button
                                            text={formState === 0 ? "Login" : "Register"}
                                            onClick={handleSubmit}
                                            />
                                    </div>
                                    
                                </div>

                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Auth;
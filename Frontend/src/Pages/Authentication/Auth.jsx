import "./Styles/AuthStyle.css"
import { useContext, useState, useRef } from 'react'
import VariableProximity from "./Header/VariableProximity";
import "./Styles/VariableProximity.css"
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import { useNavigate } from 'react-router-dom'

function Auth() {
    const router = useNavigate()
    const containerRef = useRef(null)
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [formState, setFormState] = useState(0); // 0 is for login and 1 is for register
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleAuthnetication();
    };

    const {handleRegister, handleLogin} = useContext(AuthContext)

    const handleAuthnetication = async ()=>{
        try{
            setMessage('')
            setError('')
            
            if(formState === 1){
                let result = await handleRegister(name, username, password)
                setMessage(result || "User Registered Successfully !!")
                setError('')
                setUsername('');
                setName('');
                setPassword('');
            }
            
            if(formState === 0){
                let result = await handleLogin(username, password)
                setMessage("Access Granted. Redirecting...")                
                setError('')
                setUsername('');
                setName('');
                setPassword('');
                setTimeout(() => {
                    router("/home")
                }, 1500)
            }
        }
        catch(err){
            if(err && err.response && err.response.data && err.response.data.message){
                setError(err.response.data.message)
            } else {
                setError('Authentication Failed. Please try again !!!')
            }
            setMessage('');
        }
    }

    return (
        <div className="auth-zenith-root">
            {/* Zenith Atmospheric Background */}
            <div className="zenith-bg">
                <div className="aurora aurora-1"></div>
                <div className="aurora aurora-2"></div>
                <div className="aurora aurora-3"></div>
                <div className="grain-overlay"></div>
            </div>

            <div className="zenith-content-scroller">
                <div className="zenith-form-stack">
                    
                    {/* Atmospheric Header */}
                    <header className="zenith-heading">
                        <div ref={containerRef} className="zenith-title-proxy">
                            <VariableProximity
                                label={'Welcome to NexMeet'}
                                className={'zenith-proximity-label'}
                                fromFontVariationSettings="'wght' 100, 'opsz' 9"
                                toFontVariationSettings="'wght' 900, 'opsz' 40"
                                containerRef={containerRef}
                                radius={200}
                                falloff="linear"
                            />
                        </div>
                    </header>

                    {/* Dynamic Feedback */}
                    {(message || error) && (
                        <div className="zenith-alert-host">
                            <div className={`zenith-alert-badge ${message ? 'success' : 'error'}`}>
                                <span className="alert-shimmer"></span>
                                {message || error}
                            </div>
                        </div>
                    )}

                    {/* The Zenith Card */}
                    <main className="zenith-card">
                        <div className="zenith-card-inner">
                            <div className="border-beam"></div>
                            
                            {/* Navigation Tabs */}
                            <nav className="zenith-tabs">
                                <button 
                                    onClick={() => setFormState(0)} 
                                    className={`zenith-tab ${formState === 0 ? 'active' : ''}`}
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => setFormState(1)} 
                                    className={`zenith-tab ${formState === 1 ? 'active' : ''}`}
                                >
                                    Register
                                </button>
                                <div className={`zenith-tab-glider state-${formState}`}></div>
                            </nav>

                            {/* Main Form Fields */}
                            <form className="zenith-form" onSubmit={handleSubmit}>
                                <div className="zenith-fields-container">
                                    {formState === 1 && (
                                        <div className="zenith-field-wrap staggered-1">
                                            <div className="zenith-input-shell">
                                                <input 
                                                    onChange={(e) => setName(e.target.value)} 
                                                    type="text" 
                                                    placeholder=" "
                                                    className="zenith-input"
                                                    value={name}
                                                    required
                                                />
                                                <label className="zenith-label">Full Name</label>
                                                <div className="zenith-focus-light"></div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="zenith-field-wrap staggered-2">
                                        <div className="zenith-input-shell">
                                            <input 
                                                onChange={(e) => setUsername(e.target.value)} 
                                                type="text" 
                                                placeholder=" " 
                                                className="zenith-input"
                                                value={username}
                                                required
                                            />
                                            <label className="zenith-label">Username</label>
                                            <div className="zenith-focus-light"></div>
                                        </div>
                                    </div>

                                    <div className="zenith-field-wrap staggered-3">
                                        <div className="zenith-input-shell">
                                            <input 
                                                onChange={(e) => setPassword(e.target.value)} 
                                                type={showPassword ? "text" : "password"}
                                                placeholder=" " 
                                                className="zenith-input"
                                                value={password}
                                                required
                                            />
                                            <label className="zenith-label">Password</label>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="zenith-eye-toggle"
                                            >
                                                {showPassword ? (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="m1 1 22 22"/>
                                                    </svg>
                                                ) : (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                                    </svg>
                                                )}
                                            </button>
                                            <div className="zenith-focus-light"></div>
                                        </div>
                                    </div>

                                    <div className="zenith-action staggered-4">
                                        <button type="submit" className="zenith-submit">
                                            <span className="zenith-submit-text">
                                                {formState === 0 ? "Login" : "Register"}
                                            </span>
                                            <span className="zenith-submit-beam"></span>
                                        </button>
                                    </div>
                                    
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Auth;
import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import "./Styles/LandingPage.css";

function LandingPage() {
    return (
        <div className="ethereal-landing-wrapper">
            <div className="ambient-background">
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
            </div>

            <Navbar />
            
            <main className="hero-container">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hero-badge"
                >
                    <span className="badge-featured">New</span>
                    <span>HD Video Architecture 2.0</span>
                </motion.div>

                <motion.h1 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="hero-title"
                >
                    Video meetings that<br/>feel like <span>magic.</span>
                </motion.h1>

                <motion.p 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="hero-subtitle"
                >
                    Experience crystal-clear, zero-latency communication designed for modern teams. Secure, fast, and beautifully simple.
                </motion.p>

                <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="hero-actions"
                >
                    <a href="/auth" className="btn-primary-large">
                        Start for free
                    </a>
                    <a href="/joinMeeting" className="btn-secondary-large">
                        Join a meeting
                    </a>
                </motion.div>

                <motion.div 
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="hero-preview-window"
                >
                    <div className="window-header">
                        <div className="traffic-lights">
                            <span></span><span></span><span></span>
                        </div>
                        <div className="window-title">nexmeet.app/room/design</div>
                    </div>
                    <div className="window-body">
                        <div className="placeholder-video-grid">
                            <div className="video-tile">
                                <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" alt="Video call participant 1" />
                            </div>
                            <div className="video-tile">
                                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" alt="Video call participant 2" />
                            </div>
                            <div className="video-tile">
                                <img src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=800" alt="Video call participant 3" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

export default LandingPage;
import React from "react";
import { motion } from "framer-motion";
import "./Styles/Navbar.css";

function Navbar() {
    return (
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} /* Apple spring-like */
            className="ethereal-nav-container"
        >
            <div className="ethereal-nav-glass">
                <a href="/" className="nav-brand">
                    <div className="brand-dot"></div>
                    <span>NexMeet</span>
                </a>
                
                <nav className="nav-menu">
                    <a href="/home" className="menu-link">Products</a>
                    <a href="/home" className="menu-link">Solutions</a>
                    <a href="/home" className="menu-link">Guest Join</a>
                </nav>

                <div className="nav-actions">
                    <a href="/auth" className="link-ghost">Register</a>
                    <motion.a 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href="/auth" 
                        className="btn-pill"
                    >
                        Sign In
                    </motion.a>
                </div>
            </div>
        </motion.div>
    );
}

export default Navbar;

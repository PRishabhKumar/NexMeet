import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";
import WithAuth from "../../Utils/WithAuth";
import axios from "axios";
import server from "../../environment";
import SplitText from "./SplitText";
import "./Styles/HomePageStyles.css";

function HomePage() {
  const { handleLogout } = useContext(AuthContext);
  const [displayAlert, setDisplayAlert] = useState(false);
  const router = useNavigate();

  const username = localStorage.getItem("username") || "User";

  function generateRoomName(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Meeting link copied to clipboard!");
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const handleJoinMeeting = () => {
    router("/joinMeeting");
  };

  const handleLogoutButtonClick = async () => {
    try {
      await handleLogout();
      setDisplayAlert(true);
      setTimeout(() => setDisplayAlert(false), 3000);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const handleStartMeeting = async () => {
    if (!username) return;
    try {
      let roomName = generateRoomName();
      await axios.post(`${server}/api/v1/users/add_activity/${username}`, {
        meetingID: roomName,
        meetingDate: Date.now(),
      });
      let url = `${window.location.origin}/${roomName}`;
      await copyToClipboard(url);
      router(`/${roomName}`);
    } catch (e) {
      console.error("Meeting generation error:", e);
    }
  };

  return (
    <div className="homePageContainer">
      {/* Premium Ambient Background */}
      <div className="background-decoration">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="glow-orb orb-1" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="glow-orb orb-2" 
        />
      </div>

      {/* Floating Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="navbarContainer"
      >
        <div className="navbarRow">
          <div className="navbarItem left">
            <button className="go-back-button" onClick={() => router("/")}>
              <div className="brand-dot" />
              <span>NexMeet</span>
            </button>
          </div>

          <div className="navbarItem center">
            <SplitText
              text={`Hi, ${username}`}
              className="welcome-text"
              delay={50}
              duration={0.6}
              ease="power4.out"
              tag="h1"
            />
          </div>

          <div className="navbarItem right rightButtonsContainer">
            <a href="/history" className="history-link">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>History</span>
            </a>
            {/* NEW CUSTOM LOGOUT BUTTON - Built into Home Page */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleLogoutButtonClick}
              className="btn-logout-custom"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="main-content">
        <div className="content-wrapper">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="subtitle-container"
          >
            <h2 className="hero-title-main">
              Meet like it's <span>magic.</span>
            </h2>
            <p className="hero-desc">
              Experience the pinnacle of high-fidelity communication. Zero latency, crystal clear, and beautifully simple.
            </p>
          </motion.div>

          {/* Action Grid */}
          <div className="meeting-grid">
            <motion.div
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="meeting-card card-primary"
              onClick={handleStartMeeting}
            >
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10L19.553 7.724C20.3597 7.32 21 7.82 21 8.724V15.276C21 16.18 20.3597 16.68 19.553 16.276L15 14M5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-text">
                <h3 className="card-title">New Meeting</h3>
                <p className="card-subtitle">Generate a secure room instantly</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="meeting-card"
              onClick={handleJoinMeeting}
            >
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="#0066CC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-text">
                <h3 className="card-title">Join Meeting</h3>
                <p className="card-subtitle">Enter a code to join someone</p>
              </div>
            </motion.div>
          </div>

          {/* Features Strip */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="features-strip"
          >
            <div className="feature-item">
              <div className="feature-dot" />
              <span className="feature-text-premium">Ultra HD Video</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot" />
              <span className="feature-text-premium">4k Screenshare</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot" />
              <span className="feature-text-premium">AES-256 Encrypted</span>
            </div>
          </motion.div>
        </div>

        {/* Custom Logout Toast */}
        <AnimatePresence>
          {displayAlert && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="logout-toast"
            >
              Successfully logged out
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default WithAuth(HomePage);

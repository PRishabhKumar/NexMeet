import "./Styles/HomePageStyles.css";
import SplitText from "./SplitText";
import LogoutButton from "./LogoutButton";
import {useNavigate} from 'react-router-dom'

function HomePage() {

  function generateRoomName(length = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  let copyToClipboard = async (text)=>{
    try{
      await navigator.clipboard.writeText(text)
      console.log("Text copied to clipboard")
      alert("Meeting URL has been copied to clipboard successfully !!!") 
    }
    catch(e){
      console.log(`This error occured in copying the URL to the clipboard : ${e}`)
    }
  }

  const router = useNavigate()
  const handleAnimationComplete = () => {
    console.log("animation complete")    
  };

  const handleJoinMeeting = () => {
    router("/joinMeeting")   
  };

  const handleStartMeeting = () => {
    console.log('Start meeting clicked');
    let roomName = generateRoomName()
    let url = `${window.location.origin}/${roomName}`
    copyToClipboard(url)
    .then(()=>{
      router(`/${roomName}`)
    })
  };

  return (
    <div className="homePageContainer">
      {/* Animated background elements */}
      <div className="background-decoration">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
      </div>

      <div className="headingContainer">
        <SplitText
          text="Welcome back !!"
          className="text-2xl font-semibold"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
          tag="h1"
        />
      </div>

      <div className="logoutButtonContainer">
        <LogoutButton />
      </div>

      {/* Main content area */}
      <div className="main-content">
        <div className="content-wrapper">
          <div className="subtitle-container">
            <p className="subtitle">Ready to connect?</p>
            <p className="description">Start or join a meeting in seconds</p>
          </div>

          <div className="buttons-container">
            <button className="meeting-button start-meeting" onClick={()=>{
              handleStartMeeting()
            }}>
              <div className="button-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10L19.553 7.724C20.3597 7.32 21 7.82 21 8.724V15.276C21 16.18 20.3597 16.68 19.553 16.276L15 14M5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="button-text">
                <span className="button-title">Start Meeting</span>
                <span className="button-subtitle">Create a new room</span>
              </div>
              <div className="button-arrow">→</div>
            </button>

            <button className="meeting-button join-meeting" onClick={()=>{
              handleJoinMeeting()
            }}>
              <div className="button-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="button-text">
                <span className="button-title">Join Meeting</span>
                <span className="button-subtitle">Enter with code</span>
              </div>
              <div className="button-arrow">→</div>
            </button>
          </div>

          {/* Quick stats or features */}
          <div className="features-container">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <p className="feature-text">Instant Connect</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <p className="feature-text">Secure & Private</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <p className="feature-text">HD Quality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
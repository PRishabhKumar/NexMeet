import Navbar from "./Navbar";
import "./Styles/LandingPage.css";
import Galaxy from "./Background/Galaxy.jsx";
import "./Styles/Galaxy.css";

function LandingPage() {
    return (
        <>
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <Galaxy
            mouseRepulsion={true}
            mouseInteraction={true}
            density={1.5}
            glowIntensity={0.5}
            saturation={0.8}
            hueShift={240}
            repulsionStrength={2.5} 
            />
        </div>

        <div className="landingPageContainer">
            <div className="navbarContainer">
            <div className="row">
                <Navbar />
            </div>
            </div>

            <div className="mainContentContainer">
            <div className="leftPart">
                <div className="mainHeading">
                <h1 className="text-start colouredHeading">Connect</h1>
                <h1 className="text-start"> with your loved ones</h1>
                </div>
                <div className="desc">
                <p className="smallerHeading text-start fw-medium">
                    Cover every distance using
                </p>
                <p className="companyName">NexMeet</p>
                </div>
                <div className="text-start">
                <a className="getStartedButton" href="/auth">
                    Get Started <i className="arrow fa-solid fa-arrow-right"></i>
                </a>
                </div>
            </div>

            <div className="rightPart">
                <img className="image" src="/mobile.png" alt="" />
                <div className="otherImages">
                <img className="smallImage" src="/smallImage1.jpeg" alt="" />
                <img className="smallImage" src="/smallImage2.jpg" alt="" />
                <img className="smallImage" src="/smallImage3.jpg" alt="" />
                </div>
            </div>
            </div>
        </div>
        </>
    );
}

export default LandingPage;

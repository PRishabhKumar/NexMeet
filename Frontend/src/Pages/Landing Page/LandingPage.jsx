import Navbar from "./Navbar";
import "./Styles/LandingPage.css";


function LandingPage() {
    return (
        <div className="landingPageContainer">
            

            {/* Navbar */}
            <div className="navbarContainer" style={{ position: 'relative', zIndex: 10 }}>
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="mainContentContainer">
                <div className="leftPart">
                    <div className="mainHeading">
                        <h1 className="colouredHeading">Connect</h1>
                        <h1>with your loved ones</h1>
                    </div>
                    <div className="desc">
                        <p className="smallerHeading">Cover every distance using</p>
                        <p className="companyName">NexMeet</p>
                    </div>
                    <div>
                        <a className="getStartedButton" href="/auth">
                            Get Started <i className="arrow fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>

                <div className="rightPart">
                    <img className="image" src="/mobile.png" alt="Mobile app preview" />
                    <div className="otherImages">
                        <img className="smallImage" src="/smallImage1.jpeg" alt="User 1" />
                        <img className="smallImage" src="/smallImage2.jpg" alt="User 2" />
                        <img className="smallImage" src="/smallImage3.jpg" alt="User 3" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
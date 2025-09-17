import Navbar from "./Navbar.jsx"
import "./Styles/LandingPageStyle.css"
function LandingPage() {
    return ( 
        <>
            <div className="mainContentContainer container-fluid">
                <div className="row">
                    <Navbar/>
                </div>                  
            </div>
            <div className="container-fluid">
                <div className="row mainContent">
                    <div className="col-4 leftPart">
                        <div className="mainHeading">
                            <h1 className="text-start colouredHeading">Connect</h1>
                            <h1 className="text-start"> with your loved ones</h1>
                        </div>
                        <p className="smallerHeading text-start fw-medium">Cover every distance using NexMeet</p>
                        <div className="text-start">
                            <a className="getStartedButton" href="">Get Started</a>
                        </div>
                    </div>
                    <div className="col-8"></div>
                </div>
            </div>
        </>
    );
}

export default LandingPage;
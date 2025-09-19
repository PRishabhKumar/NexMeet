import Navbar from "./Navbar.jsx"
import "./Styles/OldLandingPageStyle.css"
function OldLandingPage() {
    return ( 
        <>
            <div className="bgWrapper">
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
                            <div className="desc">
                                <p className="smallerHeading text-start fw-medium">Cover every distance using</p>
                                <p className="companyName">NexMeet</p>
                            </div>
                            <div className="text-start">
                                <a className="getStartedButton" href="/auth">Get Started <i class="arrow fa-solid fa-arrow-right"></i></a>
                            </div>
                        </div>
                        <div className="col-8 rightPart">                        
                            <img className="image" src="/mobile.png" alt="" />    
                            <div className="otherImages">                            
                                <img className="smallImage" src="/smallImage1.jpeg" alt="" />                               
                                <img className="smallImage" src="/smallImage2.jpg" alt="" />
                                <img className="smallImage" src="/smallImage3.jpg" alt="" />                         
                            </div>                                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OldLandingPage;
import "./Styles/Navbar.css"

function Navbar() {
    return ( 
        <div className="navbar-container">
            <div className="row align-items-center">
                <div className="col-4 d-flex align-items-center">
                    <h1 className="heading">NexMeet</h1>
                </div>
                <div className="col-8">
                    <nav className="navbar navbar-expand-lg custom-navbar">
                        <div className="container-fluid justify-content-end">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="#">Join as Guest</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" href="/auth">Register</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active loginButton" href="/auth">Login</a>
                                </li>                            
                            </ul>                        
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Navbar;

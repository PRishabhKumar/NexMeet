import "./Styles/HomePageStyles.css";
import DotGrid from "./DotGrid";

function HomePage() {
    return (
        <div className="mainContentContainer">
            <DotGrid
                dotSize={10}
                gap={51}
                baseColor="#1a1a2e"
                activeColor="#00fff5"
                proximity={170}
                shockRadius={500}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
            />
        </div>
    );
}

export default HomePage;

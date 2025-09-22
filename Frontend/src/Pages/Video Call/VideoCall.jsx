import "./Styles/VideoCall.css"
import server from "../../environment.js"
import {useState, useRef} from 'react'
const serverPath = server

let connections = {}

const peerConfigConections = {
    "iceServers": [
        {
            "urls": "stun:stun.l.google.com:19302"
        }
    ]
}

function VideoCall() {

    let socketref = useRef();
    let socketIdRef = useRef();
    let localVideoRed = useRef();
    // State varaibles
    // These variables are used to determine whether the user has given the permissions to use the video and audio resources or not
    let [videoPermissionsAvailable, setVideoPermissionsAvailable] = useState(true);
    let [audioPermissionsAvailable, setAudioPermissionsAvailable] = useState(true);
    // These variables are used to control the turning on and off of the audio and video
    let [video, setVideo] = useState();
    let [audio, setAudio] = useState();
    let [screenShare, setScreenShare] = useState();

    let [showModal, setShowModal] = useState();
    let [screenShareAvailable, setScreenShareAvailable] = useState();

    let [messages, setMessages] = useState();

    let [message, setMessage] = useState("");
    
    // The variable below is used to control the notifications whenever we recieve a new message from someone
    let [newMessages, setNewMessages] = useState(0); 

    let [askForUsername, setAskForUsername] = useState(0); // this is used to handle the cases of guest logins

    let [username, setUsername] = useState("")

    const videoRef = useRef([])

    // The below varaible handles the different videos in the call

    let [videos, setVideos] = useState([])

    return ( 
        <>
            <div>
                {
                    askForUsername === true ? 
                    <div>
                        
                    </div> : 
                    <>
                        <h1>Here we will have the full code for the video calling
                    </h1></>
                }
            </div>
        </>
    );
}

export default VideoCall;
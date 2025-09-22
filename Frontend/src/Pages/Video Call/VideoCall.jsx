import "./Styles/VideoCall.css"
import server from "../../environment.js"
import {useState, useEffect, useRef} from 'react'
import Input from "./Input.jsx"
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
    let localVideoRef = useRef();
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

    let [askForUsername, setAskForUsername] = useState(true); // this is used to handle the cases of guest logins

    let [username, setUsername] = useState("")

    const videoRef = useRef([])

    // The below varaible handles the different videos in the call

    let [videos, setVideos] = useState([])

    const getMediaPermissions = async ()=>{
        try{
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true}) 
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }           
            // update the state variables
            setVideoPermissionsAvailable(true)
            setAudioPermissionsAvailable(true)
            window.localStream = stream;
        }
        catch(err){
            setVideoPermissionsAvailable(false);
            setAudioPermissionsAvailable(false);
            throw err;
        }
    }

    useEffect(()=>{
        getMediaPermissions();
    }, [])

    // Here we are using the conditional useEffect because we want these things to execute only when there are any changes in the audio or video

    const getUserMediaSuccess = (stream)=>{
        
    }

    const getUserMedia = ()=>{
        if((video && videoPermissionsAvailable) || (audio && audioPermissionsAvailable)){
            navigator.mediaDevices.getUserMedia({video: video, audio: audio}) // here we are setting the status of audio and video based on the current status of them in case any changes happen
            .then(()=>{}) // add the function for getUserMedia usccess
            .then((stream)=>{})
            .catch(err=>{
                console.log(`This error occured : ${err}`)
            })
        }
        else{
            try{
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track=>track.stop())
            }
            catch(err){
                console.log(`This error occured : ${err}`)
            }
        }
    }

    useEffect(()=>{
        if(video !== undefined && audio !== undefined){
            getUserMedia();
        }
    }, [audio, video])

    let getMedia = ()=>{
        setVideo(videoPermissionsAvailable)
        setAudio(audioPermissionsAvailable)
        connectToSocketServer();
    }

    return ( 
        <>
            <div className="contentContainer">
                {
                    askForUsername === true ? 
                    <div>
                        <h2 style={{color: "white"}}>Enter into the lobby</h2>
                        <h3>Enter your username</h3>
                        <input type="text" value={username} className="username" onChange={(e)=>{setUsername(e.target.value)}} />
                        <button>Connect</button>
                        <div>
                            <video ref={localVideoRef} autoPlay muted></video>
                        </div>
                        
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
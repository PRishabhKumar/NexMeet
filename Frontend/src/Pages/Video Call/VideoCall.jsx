import "./Styles/VideoCall.css"
import server from "../../environment.js"
import {useState, useEffect, useRef} from 'react'
import Input from "./Input.jsx"
import io from 'socket.io-client'
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

    let socketRef = useRef();
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

    // Function to handle the event of recieving a message from the server

    let messageRecievedFromServer = ()=>{

    }

    // Fucntion to add the chat messages 

    let addChatMessage = ()=>{

    }

    const connectToSocketServer = ()=>{
        socketRef.current = io.connect(serverPath, {secure: false})

        socketRef.current.on('signal', messageRecievedFromServer); // this is teh signal from the backend server whenever some mesage is recieved from the server and we are catching and handling it here

        socketRef.current.on('connect', ()=>{
            socketRef.current.emit('join-call'); // when a user connects, then he is basically trying to join the call and the signal for that will be emitted from here and caught by the backend server where we will handle adding the person to the call and so on
            socketIdRef.current = socketRef.current.id; // after connecitng this socket would have got an ID

            socketRef.current.on('chat-message', addChatMessage); // here we are catching the event of one user sending a mesasge to the other

            socketRef.current.on('user-left', (id)=>{
                setVideo()(videos.filter((video)=>{
                    video.socketId !== id; // keep all the other videos except for the one that has left
                }))
            })

            socketRef.current.on('user-joined', (id, clients)=>{
                clients.forEach((socketListId)=>{

                    connections[socketListId] = new RTCPeerConnection(peerConfigConections)

                    connections[socketListId].onicecandidate = (event)=>{
                        if(event.candidate != null){
                            socketRef.current.emit('signal', socketListId, JSON.stringify({'ice': event.candidate}))
                        }
                    }

                    connections[socketListId].onaddstream = (event)=>{
                        // Here we are simply checking is the video already exists because if it does then addition of a stream that there have some changes in audio/video i.e. turning them on/off or screen sharing. Hence if the video already exists, then we are simply adding the stream to it and if not then we will create a new video
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId)

                        if(videoExists){
                            const updateVideo = videos.map(video => {
                                video.socketId === socketListId ? {...video, stream : event.stream} : video
                            })
                            videoRef.current = updateVideo
                        }
                        else{
                            // here we are adding a new stream
                            const newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoPlay: true,
                                playsinline: true
                            }
                            setVideos(videos=>{
                                const updatedVideos = [...videos, newVideo] 
                                videoRef.current = updatedVideos
                                return updatedVideos
                            })
                        }
                    }

                    
                    if(window.localStream != undefined  && window.localStream != null){
                        connections[socketListId].addStream(window.localStream)
                    }
                    else{
                        console.log("We have black silence here")
                        // implement black silence here
                    }


                })

                if(id === socketIdRef.current){
                    for(let id2 in connections){
                        if(id2 === socketIdRef.current){
                            continue;
                        }
                        else{
                            try{
                                connections[id2].addStream(window.localStream)
                            }
                            catch(err){
                                throw err;
                            }
                            connections[id2].createOffer()
                            .then((description)=>{
                                connections[id2].setLocalDescrpition(description)
                                .then(()=>{
                                    socketRef.current.emit('signal', id2, JSON.stringify({"sdp":  connections[id2].setLocalDescrpition}))
                                })
                            })
                            .catch(e=>{
                                console.log(`This error occured : ${e}`)
                            })
                        }
                    }
                }

            })

        })
    }

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

    let connect = ()=>{
        setAskForUsername(false); 
        getMedia(); // after the username is entered, we will disable the asking for username again and will proceed to connct to the socket server and update the audio and video
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
                        <button onClick={connect}>Connect</button>
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
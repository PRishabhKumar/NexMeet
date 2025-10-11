import "./Styles/VideoCall.css"
import server from "../../environment.js"
import {useState, useEffect, useRef} from 'react'
import Input from "./Input.jsx"
import MessageSendButton from "./MessageSendButton.jsx"
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
    // State variables
    let [videoPermissionsAvailable, setVideoPermissionsAvailable] = useState(true);
    let [audioPermissionsAvailable, setAudioPermissionsAvailable] = useState(true);
    let [video, setVideo] = useState(false);
    let [audio, setAudio] = useState(false);
    let [screenShare, setScreenShare] = useState(false);
    let [showModal, setShowModal] = useState();
    let [screenShareAvailable, setScreenShareAvailable] = useState(true);
    let [messages, setMessages] = useState();
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0); 
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("")
    const videoRef = useRef([])
    let [videos, setVideos] = useState([])
    let [chatButtonClicked, setChatButtonClicked] = useState(false);

    // Function to handle the event of recieving a message (i.e. an offer) from the server
    let messageRecievedFromServer = (fromId, message)=>{
        let signal = JSON.parse(message);
        if(fromId !== socketIdRef.current){
            if(signal.sdp){
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
                .then(()=>{
                    if(signal.sdp.type === "offer"){
                        connections[fromId].createAnswer()
                        .then((description)=>{
                            connections[fromId].setLocalDescription(description)
                            .then(()=>{
                                socketRef.current.emit('signal',  fromId, JSON.stringify({'sdp': connections[fromId].localDescription}))
                            })
                            .catch(err=>{
                                console.log(`Answer creation error: ${err}`)
                            })
                        })
                        .catch(err =>{
                            console.log(`Answer creation error: ${err}`)
                        })
                    }
                })
                .catch(err =>{
                    console.log(`Set remote description error: ${err}`)
                })
            }
            if(signal.ice){
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice))
                .catch(err =>{
                    console.log(`ICE candidate error: ${err}`)
                })
            }
        }                
    }

    let addChatMessage = ()=>{
        // Chat implementation
    }

    const connectToSocketServer = ()=>{
        socketRef.current = io.connect(serverPath, {secure: false})

        socketRef.current.on('signal', messageRecievedFromServer);

        socketRef.current.on('connect', ()=>{
            socketRef.current.emit('join-meeting', window.location.href);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addChatMessage);

            socketRef.current.on('user-left', (id)=>{
                console.log('User left:', id);
                setVideos(prevVideos => prevVideos.filter((video) => video.socketId !== id));
                // Clean up connection
                if (connections[id]) {
                    connections[id].close();
                    delete connections[id];
                }
            })

            socketRef.current.on('user-joined', (id, clients)=>{
                console.log('User joined:', id, 'Clients:', clients);
                console.log('My socket ID:', socketIdRef.current);
                
                clients.forEach((socketListId)=>{
                    // Skip creating connection to self
                    if(socketListId === socketIdRef.current) return;
                    
                    console.log('Creating connection to:', socketListId);
                    connections[socketListId] = new RTCPeerConnection(peerConfigConections)

                    connections[socketListId].onicecandidate = (event)=>{
                        if(event.candidate != null){
                            console.log('Sending ICE candidate to:', socketListId);
                            socketRef.current.emit('signal', socketListId, JSON.stringify({'ice': event.candidate}))
                        }
                    }

                    // FIXED: Use modern ontrack instead of deprecated onaddstream
                    connections[socketListId].ontrack = (event)=>{
                        console.log('Track received from:', socketListId, event.streams[0]);
                        
                        if (event.streams && event.streams[0]) {
                            setVideos(prevVideos => {
                                // Check if video already exists
                                let videoExists = prevVideos.find(video => video.socketId === socketListId);
                                
                                if(videoExists){
                                    console.log('Updating existing video for:', socketListId);
                                    const updatedVideos = prevVideos.map(video => 
                                        video.socketId === socketListId ? {...video, stream: event.streams[0]} : video
                                    );
                                    videoRef.current = updatedVideos;
                                    return updatedVideos;
                                }
                                else{
                                    console.log('Adding new video for:', socketListId);
                                    const newVideo = {
                                        socketId: socketListId,
                                        stream: event.streams[0],
                                        username: `User ${socketListId}`,
                                        autoPlay: true,
                                        playsinline: true,
                                        videoEnabled: true,
                                        audioEnabled: true
                                    };
                                    const updatedVideos = [...prevVideos, newVideo];
                                    videoRef.current = updatedVideos;
                                    return updatedVideos;
                                }
                            });
                        }
                    }

                    // FIXED: Ensure local stream is ready before adding
                    const addLocalStreamToConnection = () => {
                        if(window.localStream && window.localStream.getTracks().length > 0){
                            console.log('Adding local stream to connection:', socketListId);
                            // Add each track individually (modern approach)
                            window.localStream.getTracks().forEach(track => {
                                connections[socketListId].addTrack(track, window.localStream);
                            });
                        }
                        else{
                            console.log('No local stream available, adding black silence');
                            let blackSilence = (...args)=> new MediaStream([blackScreen(...args), silence(...args)]) 
                            window.localStream = blackSilence();
                            window.localStream.getTracks().forEach(track => {
                                connections[socketListId].addTrack(track, window.localStream);
                            });
                        }
                    };

                    addLocalStreamToConnection();
                })

                // FIXED: Add delay to ensure connections are properly set up
                setTimeout(() => {
                    // If this user just joined, initiate offers to all existing users
                    if(id === socketIdRef.current){
                        console.log('I just joined, creating offers for existing users');
                        for(let id2 in connections){
                            if(id2 === socketIdRef.current){
                                continue;
                            }
                            console.log('Creating offer for:', id2);
                            connections[id2].createOffer()
                            .then((description)=>{
                                return connections[id2].setLocalDescription(description);
                            })
                            .then(()=>{
                                console.log('Sending offer to:', id2);
                                socketRef.current.emit('signal', id2, JSON.stringify({"sdp": connections[id2].localDescription}))
                            })
                            .catch(e=>{
                                console.log(`Error creating offer for ${id2}:`, e)
                            })
                        }
                    }
                }, 1000); // 1 second delay to ensure stream is ready
            })
        })
        // Handling user's toggling of audio and video       
        
        socketRef.current.on('user-video-toggle', (data) => {
            setVideos(prevVideos => 
                prevVideos.map(video => 
                    video.socketId === data.socketId 
                        ? {...video, videoEnabled: data.videoEnabled}
                        : video
                )
            );
        });

        // Listener for audio toggles 

        socketRef.current.on('user-audio-toggle', (data) => {
        console.log('Received audio toggle from:', data.socketId, 'enabled:', data.audioEnabled);
        setVideos(prevVideos => 
            prevVideos.map(video => 
                video.socketId === data.socketId 
                    ? {...video, audioEnabled: data.audioEnabled}
                    : video
                )
            );
        });

    }

    const getMediaPermissions = async ()=>{
        try{
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true}) 
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }           
            setVideoPermissionsAvailable(true)
            setAudioPermissionsAvailable(true)
            window.localStream = stream;
            console.log('Media permissions granted, stream ready:', stream);
            return stream;
        }
        catch(err){
            console.log('Media permissions error:', err);
            setVideoPermissionsAvailable(false);
            setAudioPermissionsAvailable(false);
            // Create fallback stream
            let blackSilence = (...args)=> new MediaStream([blackScreen(...args), silence(...args)]) 
            window.localStream = blackSilence();
            if(localVideoRef.current) {
                localVideoRef.current.srcObject = window.localStream;
            }
            throw err;
        }
    }

    useEffect(()=>{
        if(!askForUsername && window.localStream && localVideoRef.current){
            localVideoRef.current.srcObject = window.localStream;
        }
    }, [askForUsername])

    useEffect(()=>{
        getMediaPermissions();
    }, [])

    const getUserMediaSuccess = (stream)=>{
        try{
            if (window.localStream) {
                window.localStream.getTracks().forEach((track)=>{
                    track.stop()
                })
            }            
        }   
        catch(err){
            console.log(`Track cleanup error: ${err}`)
        }   
        
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        // Update all existing connections with new stream
        for (let id in connections){
            if(id === socketIdRef.current){
                continue;
            }
            
            // Remove old tracks and add new ones
            const senders = connections[id].getSenders();
            senders.forEach(sender => {
                if (sender.track) {
                    connections[id].removeTrack(sender);
                }
            });

            // Add new tracks
            stream.getTracks().forEach(track => {
                connections[id].addTrack(track, stream);
            });

            // Create new offer
            connections[id].createOffer()
            .then((description)=>{
                connections[id].setLocalDescription(description)
                .then(()=>{
                    socketRef.current.emit('signal', id ,JSON.stringify({'sdp': connections[id].localDescription}))
                })
                .catch(err =>{
                    console.log(`Set local description error: ${err}`)
                })
            })
            .catch(err =>{
                console.log(`Create offer error: ${err}`)
            })
        }

        stream.getTracks().forEach((track)=>{
            track.onended = ()=>{
                setVideo(false);
                setAudio(false);

                try{
                    let tracks = localVideoRef.current.srcObject.getTracks()
                    tracks.forEach((track)=>{
                        track.stop()
                    })
                }
                catch(err){
                    console.log(`Track cleanup error: ${err}`)
                }

                let blackSilence = (...args)=> new MediaStream([blackScreen(...args), silence(...args)]) 
                window.localStream = blackSilence();
                localVideoRef.current.srcObject = window.localStream;

                for(let id in connections){
                    const senders = connections[id].getSenders();
                    senders.forEach(sender => {
                        if (sender.track) {
                            connections[id].removeTrack(sender);
                        }
                    });

                    window.localStream.getTracks().forEach(track => {
                        connections[id].addTrack(track, window.localStream);
                    });

                    connections[id].createOffer()
                    .then((description)=>{
                        connections[id].setLocalDescription(description)
                        .then(()=>{
                            socketRef.current.emit('signal', id, JSON.stringify({'sdp': connections[id].localDescription}))
                        })
                        .catch(err =>{
                            console.log(`Set local description error: ${err}`)
                        })
                    })
                    .catch(err =>{
                        console.log(`Create offer error: ${err}`)
                    })
                }
            }
        })
    }

    let silence = ()=>{
        let context = new AudioContext()
        let oscillator = context.createOscillator()
        let destination = oscillator.connect(context.createMediaStreamDestination());
        oscillator.start();
        context.resume();
        return Object.assign(destination.stream.getAudioTracks()[0], {enabled: false})
    }

    let blackScreen = ({width = 640, height = 480} = {})=>{
        let canvas = Object.assign(document.createElement('canvas'), {width, height})
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], {enabled: false})
    }

    const getUserMedia = ()=>{
        if((video && videoPermissionsAvailable) || (audio && audioPermissionsAvailable)){
            navigator.mediaDevices.getUserMedia({video: video, audio: audio})
            .then(getUserMediaSuccess)
            .catch(err=>{
                console.log(`Get user media error: ${err}`)
            })
        }
        else{
            try{
                if (localVideoRef.current && localVideoRef.current.srcObject) {
                    let tracks = localVideoRef.current.srcObject.getTracks();
                    tracks.forEach(track=>track.stop())
                }
            }
            catch(err){
                console.log(`Track cleanup error: ${err}`)
            }
        }
    }

    useEffect(()=>{
        if(video !== undefined && audio !== undefined){
            getUserMedia();
        }
    }, [audio, video])

    useEffect(() => {
        console.log('Videos state updated:', videos);
    }, [videos]);

    let getMedia = async ()=>{
        // FIXED: Ensure stream is ready before connecting
        try {
            if (!window.localStream || window.localStream.getTracks().length === 0) {
                console.log('Waiting for media stream...');
                await getMediaPermissions();
            }
            setVideo(videoPermissionsAvailable)
            setAudio(audioPermissionsAvailable)
            connectToSocketServer();
        } catch (error) {
            console.error('Error getting media:', error);
            // Connect anyway with fallback stream
            connectToSocketServer();
        }
    }

    let connect = async ()=>{
        if(username.trim() === "") {
            alert("Please enter a username");
            return;
        }
        setAskForUsername(false); 
        await getMedia();
    }

    // Logic for screen sharing 

    let getDisplayMediaSuccess = (stream)=>{
        try{
            window.localStream.getTracks().forEach((track)=>{
                track.stop()
            })
        }
        catch(err){
            console.log(`This error occured : ${err}`)
        }
        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for(let id in connections){
            if(id !== socketIdRef.current){
                window.localStream.getTracks().forEach(track=>{
                    connections[id].addTrack(track, window.localStream)
                })
                connections[id].createOffer()
                .then((description)=>{
                    connections[id].setLocalDescription(description)
                    .then(()=>{
                        socketRef.current.emit('signal', id, JSON.stringify({'sdp': connections[id].localDescription}))
                    })
                    .catch((err)=>{
                        console.log(`This error occured : ${err}`)
                    })
                })
            }
        }

        stream.getTracks().forEach((track)=>{
            track.onended = ()=>{
                setScreenShare(false)

                try{
                    let tracks = localVideoRef.current.srcObject.getTracks()
                    tracks.forEach((track)=>{
                        track.stop()
                    })
                }
                catch(err){
                    console.log(`Track cleanup error: ${err}`)
                }

                let blackSilence = (...args)=> new MediaStream([blackScreen(...args), silence(...args)]) 
                window.localStream = blackSilence();
                localVideoRef.current.srcObject = window.localStream;
                getUserMedia()               
            }
        })

    }

    let getDisplayMedia = ()=>{
        if(screenShare){
            if(navigator.mediaDevices.getDisplayMedia){
                navigator.mediaDevices.getDisplayMedia({video: true, audio: true})
                .then(getDisplayMediaSuccess)
                .then((stream)=>{})
                .catch((err)=>{
                    console.log(`This error occured : ${err}`)
                })
            }            
        }
        else{
            console.log(`Screen sharing was stopped by the user`)

            if(window.localStream){
                window.localStream.getTracks().forEach((track)=>{
                    track.stop()
                })
            } 
            
            let blackSilence = (...args)=> new MediaStream([blackScreen(...args), silence(...args)]) 
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;

            setTimeout(()=>{
                getUserMedia()
            }, 100)

        }
    }

    useEffect(()=>{
        if(screenShare !== undefined){
            getDisplayMedia();
        }
    }, [screenShare])

    let handleScreenShare = ()=>{
        setScreenShare(!screenShare)
    }

    // useEffect for handling 'enter' key presses to enter the call

    useEffect(()=>{
        const handleEnterKeyPress = (e)=>{
            if(e.key == 'Enter'){
                connect()
            }
        }
        document.addEventListener('keydown', handleEnterKeyPress)
        return ()=>{
            document.removeEventListener('keydown', handleEnterKeyPress)
        }
    }, [askForUsername, username])


    // Logic to send messages

    let sendMessage = ()=>{
        console.log(`A message has been sent`)
    }
    

    return ( 
        <div className="videoCallContainer">
            <div className="contentContainer">
            {
                askForUsername === true ? 
                <div className="username-section">
                    <h2>Enter into the lobby</h2>
                    <h3>Enter your username</h3>
                    <input 
                        type="text" 
                        value={username} 
                        className="username" 
                        onChange={(e)=>{setUsername(e.target.value)}} 
                        placeholder="Enter your username..."
                    />
                    <button onClick={connect}>Connect</button>                    
                    <video ref={localVideoRef} autoPlay muted playsInline></video>
                </div> : 
                <div className="video-call-container">
                    <div className="room-info">
                        <h2>Room: {window.location.pathname.substring(1) || 'default'}</h2>
                        <h2>Connected as: {username}</h2>
                    </div>

                    <div className="buttonContainer">
                        <button className="video-button" onClick={()=>{
                            const newState = !video
                            setVideo(newState)
                            socketRef.current.emit('video-toggle', {
                                socketId: socketIdRef.current,
                                videoEnabled: newState
                            })
                        }} style={{backgroundColor: video === false ? "red" : "#5f6368"}}>
                            {(video === true) ? <i class="fa-solid fa-video"></i> : <i className="fa-solid fa-video-slash"></i>}
                        </button>
                        <button className="audio-button" onClick={()=>{
                            const newState = !audio
                            setAudio(newState)
                            socketRef.current.emit('audio-toggle', {
                                socketId: socketIdRef.current,
                                audioEnabled: newState
                            })
                        }} style={{backgroundColor: audio === false ? "red" : "#5f6368"}}>
                            {(audio == true ? <i class="fa-solid fa-microphone"></i> : <i className="fa-solid fa-microphone-slash"></i>)}
                        </button>
                        <button className="end-call-button">
                            <span class="material-symbols-outlined">
                            call_end
                            </span>
                        </button>
                        {
                            (screenShareAvailable === true ? 
                                <button onClick={()=>{
                                    handleScreenShare()
                                }}>
                                    {screenShare === true ? 
                                    <span className="material-symbols-outlined">stop_screen_share</span>:
                                    <span className="material-symbols-outlined">
                                    present_to_all
                                    </span>
                                    }
                                </button> : <></>
                            )
                        }
                        <div className="chatButton">                            
                            <button onClick={()=>{
                                setChatButtonClicked(!chatButtonClicked)
                            }}>
                                <span class="material-symbols-outlined">chat</span>
                            </button>
                            {
                                newMessages !== 0 && 
                                <div className="badge">{newMessages}</div>
                            }
                        </div>
                    </div>
                    
                    <div className="videos-grid" data-count={videos.length + 1}>
                        {/* This is the chat box */}
                        <div className={`chatBoxContainer ${chatButtonClicked == true ? 'chatBoxOpen' : 'chatBoxClosed'}`}>
                            <h2 className="chatHeader">In-call messages</h2>   
                            <div className="chattingArea">
                                <div className="chatInputBox">
                                    <Input labelText="Say something..."/>
                                    <MessageSendButton 
                                        onClick = {sendMessage}
                                    />                                    
                                </div>
                            </div>                         
                        </div>
                        {/* The current user's local video */}
                        <div className="current-user-video-container">
                            
                        <div className="user-information">
                            <h2>
                                You ({username})                                
                            </h2>
                        </div>
                            
                            {
                                video === false ? 
                                <div className="videoOffScreen">
                                    <i class="fa-solid fa-video-slash"></i> 
                                </div> : 
                                <video className="current-user-video" ref={localVideoRef} autoPlay muted playsInline></video>
                            }

                            {
                                // Handle the logic for showing the audio off badge 
                                audio === false &&
                                <div className="badgeContainer">
                                    <div className="audioOffBadge">
                                        <span class="material-symbols-outlined">
                                            mic_off
                                        </span>
                                    </div>
                                </div>
                            }
                            
                        </div>
                        
                        {/* Other users' videos */}
                        {
                            videos.map((videoObject)=>{ 
                                return(
                                    <div key={videoObject.socketId} className="conference-view other-user-video-container">
                                        <div className="user-information">
                                            <h2>
                                                User: {videoObject.socketId.substring(0, 8)}...
                                            </h2>
                                        </div>                                        
                                        
                                        {
                                            videoObject.videoEnabled === false ?  // Check remote user's video state
                                            <div className="videoOffScreen">
                                                <i class="fa-solid fa-video-slash"></i> 
                                            </div> : 
                                            <video 
                                                className="other-users-video"
                                                data-socket={videoObject.socketId}
                                                ref={(ref)=>{
                                                    if(ref && videoObject.stream){
                                                        console.log('Setting video stream for:', videoObject.socketId);
                                                        ref.srcObject = videoObject.stream
                                                    }
                                                }}
                                                autoPlay 
                                                muted
                                                playsInline
                                            ></video>
                                        }
                                        {
                                            // Audio badge for other users
                                            videoObject.audioEnabled === false &&
                                            <div className="badgeContainer">
                                                <div className="audioOffBadge">
                                                    <span class="material-symbols-outlined">
                                                        mic_off
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
            </div>
        </div>
    );
}

export default VideoCall;
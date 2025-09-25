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
    // State variables
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

    // The below variable handles the different videos in the call

    let [videos, setVideos] = useState([])

    // Function to handle the event of recieving a message (i.e. an offer) from the server

    let messageRecievedFromServer = (fromId, message)=>{
        let signal = JSON.parse(message); // extract the message becuase it is sent in the JSON format
        // This simp]ly means that the sender and the reciever cannot be the same as you cannot send messages to yourself
        if(fromId !== socketIdRef.current){
            if(signal.sdp){
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
                .then(()=>{
                    if(signal.sdp.type === "offer"){
                        // if this socket has recieved an offer from some other socket, then we are sending the answer for that offer
                        connections[fromId].createAnswer()
                        .then((description)=>{
                            connections[fromId].setLocalDescription(description)
                            .then(()=>{
                                socketRef.current.emit('signal',  fromId, JSON.stringify({'sdp': connections[fromId].localDescription}))
                            })
                            .catch(err=>{
                                console.log(`This error occured : ${err}`)
                            })
                        })
                        .catch(err =>{
                            console.log(`This error occured : ${err}`)
                        })
                    }
                })
                .catch(err =>{
                    console.log(`This error occured : ${err}`)
                })
            }
            if(signal.ice){
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice))
                .catch(err =>{
                    console.log(`This error occured : ${err}`)
                })
            }
        }                
    }

    // Function to add the chat messages 

    let addChatMessage = ()=>{

    }

    const connectToSocketServer = ()=>{
        socketRef.current = io.connect(serverPath, {secure: false})

        socketRef.current.on('signal', messageRecievedFromServer); // this is the signal from the backend server whenever some mesage is recieved from the server and we are catching and handling it here

        socketRef.current.on('connect', ()=>{
            socketRef.current.emit('join-call', username); // Send username when joining
            socketIdRef.current = socketRef.current.id; // after connecting this socket would have got an ID

            socketRef.current.on('chat-message', addChatMessage); // here we are catching the event of one user sending a mesasge to the other

            socketRef.current.on('user-left', (id)=>{
                console.log('User left:', id);
                setVideos(prevVideos => prevVideos.filter((video) => video.socketId !== id)); // Use functional update to avoid stale closure
            })

            socketRef.current.on('user-joined', (id, clients)=>{
                console.log('User joined:', id, 'Clients:', clients); // Debug log
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

                    connections[socketListId].onaddstream = (event)=>{
                        console.log('Stream received from:', socketListId, event.stream); // Debug log
                        
                        setVideos(prevVideos => {
                            // Check if video already exists
                            let videoExists = prevVideos.find(video => video.socketId === socketListId);
                            
                            if(videoExists){
                                console.log('Updating existing video for:', socketListId);
                                // Update existing video
                                const updatedVideos = prevVideos.map(video => 
                                    video.socketId === socketListId ? {...video, stream: event.stream} : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            }
                            else{
                                console.log('Adding new video for:', socketListId);
                                // Add new video
                                const newVideo = {
                                    socketId: socketListId,
                                    stream: event.stream,
                                    username: `User ${socketListId}`, // You can get actual username from server
                                    autoPlay: true,
                                    playsinline: true
                                };
                                const updatedVideos = [...prevVideos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            }
                        });
                    }

                    // Add local stream to this connection
                    if(window.localStream && window.localStream.getTracks().length > 0){
                        console.log('Adding local stream to connection:', socketListId);
                        connections[socketListId].addStream(window.localStream);
                    }
                    else{
                        console.log('No local stream available, adding black silence');
                        let blackSilence = (...args)=> new MediaStream([blackScreen(...args), silence(...args)]) 
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                })

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
            console.log('Media permissions error:', err);
            setVideoPermissionsAvailable(false);
            setAudioPermissionsAvailable(false);
            throw err;
        }
    }

    // We are using the below useEffect to handle the changing of states of askForUsername state variable

    useEffect(()=>{
        if(!askForUsername && window.localStream && localVideoRef.current){
            localVideoRef.current.srcObject = window.localStream;
        }
    }, [askForUsername])

    useEffect(()=>{
        getMediaPermissions();
    }, [])

    // Here we are using the conditional useEffect because we want these things to execute only when there are any changes in the audio or video

    const getUserMediaSuccess = (stream)=>{
        try{
            // first we are getting all the tracks that are currently there and we are stopping them for now
            window.localStream.getTracks().forEach((track)=>{
                track.stop()
            })            
        }   
        catch(err){
            console.log(`This error occured : ${err}`)
        }   
        window.localStream = stream; // re-initialize with the new stream
        localVideoRef.current.srcObject = stream; // this is used to update any changes made to the media like turning on/off the audio/video that will be rendered on the UI

        // now we are iterating through the connections and ignoring if the ID is the same as the curent socket ID and if not, then we are adding the updated stream to all other sockets

        for (let id in connections){
            if(id === socketIdRef.current){
                continue;
            }
            
            connections[id].addStream(window.localStream); // here we are adding teh updated stream for all the sockets except for our own

            // Now we create another offer

            connections[id].createOffer()
            .then((description)=>{
                connections[id].setLocalDescription(description)
                .then(()=>{
                    socketRef.current.emit('signal', id ,JSON.stringify({'sdp': connections[id].localDescription}))
                })
                .catch(err =>{
                    console.log(`This error occured : ${err}`)
                })
            })
            .catch(err =>{
                console.log(`This error occured : ${err}`)
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
                    console.log(`This error occured : ${err}`)
                }

                let blackSilence = (...args)=> new MediaStream([blackScreen(...args), silence(...args)]) 
                window.localStream = blackSilence();
                localVideoRef.current.srcObject = window.localStream;  // add the black silence to the stream of the user who has started it i.e. the current socket previously in the function to connect to the socket server, we were adding the black silence for all the other sockets that are a part of the meeting

                for(let id in connections){
                    connections[id].addStream(window.localStream)
                    connections[id].createOffer()
                    .then((description)=>{
                        connections[id].setLocalDescription(description)
                        .then(()=>{
                            socketRef.current.emit('signal', id, JSON.stringify({'sdp': connections[id].localDescription}))
                        })
                        .catch(err =>{
                            console.log(`This error occured : ${err}`)
                        })
                    })
                    .catch(err =>{
                        console.log(`This error occured : ${err}`)
                    })
                }

            }
        })

    }

    let silence = ()=>{
        let context = new AudioContext()
        let oscillator = context.createOscillator() // this creates an oscillatorNode which is a source representing a periodic waveform and basically generates a constant tone (Here this constant tone will be nothing but silence)

        let destination = oscillator.connect(context.createMediaStreamDestination());
        oscillator.start(); // This starts producing the 'constant tone of silence'
        context.resume(); // now we can resume the audio context after adding the silence 
        return Object.assign(destination.stream.getAudioTracks()[0], {enabled: false})
    }

    // now we are creating the function for the black screen

    let blackScreen = ({width = 640, height = 480} = {})=>{
        let canvas = Object.assign(document.createElement('canvas'), {width, height})
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], {enabled: false})
    }


    const getUserMedia = ()=>{
        if((video && videoPermissionsAvailable) || (audio && audioPermissionsAvailable)){
            navigator.mediaDevices.getUserMedia({video: video, audio: audio}) // here we are setting the status of audio and video based on the current status of them in case any changes happen
            .then(getUserMediaSuccess) // add the function for getUserMedia success
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

    // Monitor videos state changes
    useEffect(() => {
        console.log('Videos state updated:', videos);
    }, [videos]);

    let getMedia = ()=>{
        setVideo(videoPermissionsAvailable)
        setAudio(audioPermissionsAvailable)
        connectToSocketServer();
    }

    let connect = ()=>{
        if(username.trim() === "") {
            alert("Please enter a username");
            return;
        }
        setAskForUsername(false); 
        getMedia(); // after the username is entered, we will disable the asking for username again and will proceed to connect to the socket server and update the audio and video
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
                        {
                        // Here if we would have left this part empty, then we will get an error saying that localVideoRef.current is undefined because once we add some username and click on connect, the askForUsername is being set to false and hence after that we will see the code that is written here but since there is nothing implemented here, we will get an error saying that the current object is undefined
                        }
                        <div>
                            <h2 style={{color: 'white'}}>You: {username}</h2>
                            <video ref={localVideoRef} autoPlay muted playsInline></video>
                        </div>
                        {
                            videos.map((video)=>{
                                return(
                                    <div key={video.socketId}>
                                        <h2 style={{color: 'white'}}>User ID: {video.socketId}</h2>
                                        <video 
                                            ref={(ref)=>{
                                                if(ref && video.stream){
                                                    ref.srcObject = video.stream // this adds the video stream to the div and we will be seeing the other users feed in this div
                                                }
                                            }}
                                            autoPlay 
                                            muted 
                                            playsInline
                                        ></video>
                                    </div>
                                )
                            })
                        }
                    </>
                }
            </div>
        </>
    );
}

export default VideoCall;
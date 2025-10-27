import "./Styles/EnterMeetingStyle.css"
import JoinMeetingButton from "./JoinMeetingButton"
import { useNavigate } from "react-router-dom"
import {useState} from 'react'
import axios from "axios"

function EnterMeeting() {
    const [roomName, setRoomName] = useState('')
    const router = useNavigate()
    const username = localStorage.getItem("username")
    const handleJoinMeeting = async (roomName)=>{
        try{
            if(roomName.trim()){
                const meetingDetails = {
                    meetingID: roomName,
                    username : username,
                    meetingDate : Date.now()
                }
                await axios.post(`http://localhost:3000/api/v1/users/add_activity/${username}`, meetingDetails) // this adds the meeting to the db as soon as the user joins
                console.log("Meeting added successfully to the database...")
                router(`/${roomName}`)
            }
            else{
                alert("Please enter a valid room number/ID")
            }        
        }
        catch(e){
            console.log(`This error occured : ${e}`)
        }
    }
    
    return ( 
        <div className="componentContainer">
            {/* Animated particles */}
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            
            {/* Animated lines */}
            <div className="animated-line line-1"></div>
            <div className="animated-line line-2"></div>
            <div className="animated-line line-3"></div>
            
            <h2>Enter room name/code to join</h2>
            <input 
                value={roomName} 
                onChange={(e)=>{
                    setRoomName(e.target.value)
                }} 
                type="text" 
                placeholder="Enter the meeting code/room name here" 
            />
            
            <div className="joinMeetingButtonContainer">
                <JoinMeetingButton 
                    className="joinMeetingButton" 
                    onClick={()=>{
                        handleJoinMeeting(roomName)
                    }}
                />
            </div>
        </div>
    );
}

export default EnterMeeting;
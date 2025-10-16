import "./Styles/EnterMeetingStyle.css"
import JoinMeetingButton from "./JoinMeetingButton"
import { useNavigate } from "react-router-dom"
import {useState} from 'react'
function EnterMeeting() {
    const [roomName, setRoomName] = useState('')
    const router = useNavigate()
    const handleJoinMeeting = (roomName)=>{
        try{
            if(roomName.trim()){
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
            <h2>Enter the meeting code/room name for the meeting you want to join</h2>
            <input value={roomName} onChange={(e)=>{
                setRoomName(e.target.value)
            }} type="text" placeholder="Enter the meeting code/room name here" />
            {/* <button className="joinMeetingButton" onClick={()=>{
                handleJoinMeeting(roomName)
            }}>Connect</button> */}
            <div className="joinMeetingButtonContainer">
                <JoinMeetingButton className="joinMeetingButton" onClick={()=>{
                    handleJoinMeeting(roomName)
                }}/>
            </div>
        </div>
    );
}

export default EnterMeeting;
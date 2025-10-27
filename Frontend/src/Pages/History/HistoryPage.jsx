import "./Styles/HistoryStyles.css"
import axios from "axios"
import {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom"

function HistoryPage() { 
    const router = useNavigate()
    const [meetings, setMeetings] = useState(null)
    const [username, setUsername] = useState(localStorage.getItem("username"))
    
    useEffect(() => {
        // Check if username exists in localStorage
        const storedUsername = localStorage.getItem("username")
        if (!storedUsername) {
            console.error("No username found in localStorage")
            return
        }
        setUsername(storedUsername)
        
        const getMeetings = async() => {
            try {
                console.log("Fetching meetings for username:", storedUsername) // Debug log
                const result = await axios.get(`http://localhost:3000/api/v1/users/get_activities/${storedUsername}`)
                setMeetings(result.data.meetings)
                console.log("Meeting details fetched successfully!")
            } catch(e) {
                console.error("Error fetching meeting details:", e)
            }
        }
        
        getMeetings()
    }, [])  

    if (!username) {
        return <div>Loading... or No username found</div>
    }

    return(
        <div className="meetingsContainer">
            {
                meetings !=undefined ?  (
                    <div className="meetingsList">
                        <h1 className="header">Previous meetings for {username}</h1>
                        {                            
                            meetings.map((meeting)=>{
                                return(
                                    <div style={{"color":"white"}} className="meetingContainer">
                                        <h3>Meeting ID : {meeting.meetingID}</h3>
                                        <h3>Joined on : {new Date(meeting.meetingDate).toLocaleString("en-IN", {
                                            weekday: "short"
                                        })}, {new Date(meeting.meetingDate).toLocaleString("en-IN", {
                                            year: "numeric",
                                            hour12: true,
                                            day: 'numeric',
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}</h3>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : 
                <div className="notFoundContainer">
                    <h1>There are no previous meetings for you....</h1>
                </div>
            }
            <div className="backToHomeButtonContainer">
                <button onClick={()=>{
                    router("/home")
                }}>Back to home</button>
            </div>
        </div>
    )
}

export default HistoryPage;
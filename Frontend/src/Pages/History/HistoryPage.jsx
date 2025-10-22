import "./Styles/HistoryStyles.css"
import axios from "axios"
import {useState, useEffect} from 'react'

function HistoryPage() { 
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
        <div className="historyContainer">
            <h1>Meeting History</h1>
            <h3>Username: {username}</h3>
            <h3>Meeting Details:</h3>
            {meetings ? (
                <pre>{JSON.stringify(meetings, null, 2)}</pre>
            ) : (
                <p>Loading meetings...</p>
            )}
        </div>
    )
}

export default HistoryPage;
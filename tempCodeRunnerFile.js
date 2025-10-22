import axios from "axios"

let result = await axios.get("http://localhost:5000/api/v1/users/Rishi/meetings")

console.log(result)

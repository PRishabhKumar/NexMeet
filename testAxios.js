import axios from "axios"

let result = await axios.get("http://localhost:3000/api/v1/users/get_activities/Rishi")

console.log(result)

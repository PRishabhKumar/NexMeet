// importing required packages

import express from "express"
import {createServer} from "node:http"
import {Server} from "socket.io"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import ConnectToSocket from "./Controllers/ConnectToSocket.js"
import userRoutes from "./Routes/usersRoute.js"
// Configure the .env file path

dotenv.config({path: path.resolve("../.env")})

// Creating the basic expressJS server

const app = express();
const server = createServer(app); // Wrap the app into an HTTP server
const ioServer = ConnectToSocket(server);

app.set("port", process.env.PORT || 3000) // Set the apps port number
// Configuring middlewares

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({limit: "40kb", extended: true})) // Here limit is being used so that the payload is not getting to heavy traffic in case of some misuse 
// Setting the user routes in teh server
app.use("/api/v1/users", userRoutes)
const startServer = async()=>{
    // Connecting with the MongoDB database

    const MongoDBConnection = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    console.log("Database connected successfully !!!")

    server.listen(app.get("port"), ()=>{
        console.log("The server is now ready and is listening for requests on port number 3000")
    })
}


// Get the basic home route

app.get("/", (req, res)=>{
    res.send("This is the home route")
})


startServer() 



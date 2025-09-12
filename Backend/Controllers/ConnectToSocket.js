import {Server} from "socket.io"

const ConnectToSocket = (server)=>{
    return new Server(server); // Here the server refers to the HTTP server that wraps the express app
}

export default ConnectToSocket;
import { Server } from "socket.io"

let connections = {}
let messages = {}
let onlineTime = {}

const ConnectToSocket = (server) => {
    const ioServer = new Server(server, {
        cors: {
            origin: '*', // allow all origins for now
            methods: ['GET', 'POST'],
            allowedHeaders: ['*'] // Allow all headers for now
        }
    }); // Here the server refers to the HTTP server that wraps the express app
    ioServer.on("connection", (socket) => {

        console.log("A user is connected")

        // Section to join the meeting
        socket.on("join-meeting", (path) => {
            if (connections[path] === undefined) {
                connections[path] = []; // initialize it with an empty array if it did not exist previously
            }
            connections[path].push(socket.id); // add this user to the meeting room 
            onlineTime[socket.id] = new Date();

            for (let i = 0; i < connections[path].length; i++) {
                ioServer.to(connections[path][i]).emit("user-joined", socket.id, connections[path])
            }
            if (messages[path] !== undefined) {
                for (let i = 0; i < messages[path].length; i++) {
                    // Here socket.id points to the new user that has just joined
                    ioServer.to(socket.id).emit("chat-message", messages[path][i]['data'], messages[path][i]['sender'], messages[path][i]['sender-socket-id'])
                }
            }
        })

        socket.on("signal", (recieverId, message) => {
            ioServer.to(recieverId).emit("signal", socket.id, message)
        })

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ['', false])
            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []; // initialize if it was undefined earlier
                }
                messages[matchingRoom].push({
                    'sender': sender,
                    'data': data,
                    'sender-socket-id': socket.id // this is the ID for the current socket/user who is messaging                    
                })
                console.log(`Sender : ${sender}, Message : ${data}`)
                connections[matchingRoom].forEach((connection) => {
                    ioServer.to(connection).emit("chat-message", data, sender, socket.id)
                })
            }
        })

        // event when the user toggles their video

        socket.on('video-toggle', (data) => {
            console.log(`User ${data.socketId} toggled video: ${data.videoEnabled}`);
            
            // Finding the room the user in

            const [matchingRoom, found] = Object.entries(connections)
            .reduce(([room, isFound], [roomKey, roomValue])=>{
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey, true]
                }
                return [roomKey, isFound]
            }, ['', false])
            if(found){
                // Broadcast this change to all users in this room
                connections[matchingRoom].forEach((connection)=>{
                    if(connection !== socket.id){
                        ioServer.to(connection).emit('user-video-toggle', {
                            socketId: data.socketId,
                            videoEnabled: data.videoEnabled
                        })
                    }
                })
            }
        });

        // event when the user toggles their audio

        socket.on('audio-toggle', (data) => {
            console.log(`User ${data.socketId} toggled audio: ${data.audioEnabled}`);
            
            const [matchingRoom, found] = Object.entries(connections)
            .reduce(([room, isFound], [roomKey, roomValue])=>{
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey, true]
                }
                return [room, isFound]
            }, ['', false])
            if(found == true){
                connections[matchingRoom].forEach((connection)=>{
                    if(connection !== socket.id){
                        ioServer.to(connection).emit('user-audio-toggle', {
                            socketId: data.socketId,
                            audioEnabled: data.audioEnabled
                        })
                    }
                })
            }
        });

        socket.on("disconnect", () => {
            let userDuration = Math.abs(onlineTime[socket.id] - new Date()); // this calcualtes the time elapsed since the the user joined the meeting and the current date and time i.e. when he is leaving

            let key; // this is used to find the room from which the user has left

            for (const [room, allConnections] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
                // Here for every room , we are iterating through all of the connections in that room to find the user that has just disconnected
                for (let i = 0; i < allConnections.length; i++) {
                    // This iterates through all teh users and matches their socket IDs to the one that has disconnected
                    if (allConnections[i] === socket.id) {
                        key = room; // this is the key i.e. the room from where the user has left 
                        for (let j = 0; j < connections[room].length; j++) {
                            // Here we are sending a mesasge to all the connections in that room that a this particular user has left the meeting
                            ioServer.to(connections[room][j]).emit("user-left", socket.id);
                        }
                        let index = connections[room].indexOf(socket.id); // search for the index of the disconnecting user

                        connections[room].splice(index, 1); // this removes that socket id from the list of connections in that room

                        // If the room becomes empty, then drop that room
                        if (connections[room].length === 0) {
                            delete connections[room];
                        }
                    }
                }
            }
        })

    })
    return ioServer;
}

export default ConnectToSocket;

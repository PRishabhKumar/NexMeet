// Here we will the writing the register and login functions

import crypto from "crypto"
import httpStatus from "http-status"
import {User} from "../Models/userModel.js"
import bcrypt, {hash} from "bcrypt"
import { MeetingModel } from "../Models/MeetingModel.js"


// function to register the user 

const registerUser = async (req, res)=>{
    let {name, emailID, username, password} = req.body
    // Create a new user
    try{
        const existingUser = await User.findOne({username}); // try to find a user wuith the same username, if any
        if(existingUser){
            return(res.status(httpStatus.FOUND).json({message: "A user already exists with this username"})) // early return statement
        }
        const hashedPassword = await bcrypt.hash(password, 10); // here the 10 means that a total of 2^10 = 1024 hashes are to be performed
        let newUser = new User({
            name: name,
            emailID: emailID,
            username: username,
            password: hashedPassword,            
        })

        // save the user to the database

        await newUser.save();

        res.status(httpStatus.CREATED).json({message: "User created successfully !!!"});
        
    }
    catch(e){
        res.send(`This error occured : ${e}`)
    }
}

// Function to authenticate the user 

const authenticateUser = async (req, res)=>{
    const {username, password} = req.body; //get the details from the form that is filled by the user
    try{
        if(!username || !password){
            return(res.status(httpStatus.NOT_FOUND).json({message: "Incompleted details....."}))  
        }
        const user = await User.findOne({username})
        if(!user){
            return(res.status(httpStatus.NOT_FOUND).json({message: "No user found with teh given crednetials"}))
        }
        // Checking the password if the user is found

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            // in case of successful authentication, generate the token
            const token = crypto.randomBytes(20).toString("hex"); // generate a hex token of 20 bytes
            user.token = token; 
            // Save the user again to update details
            await user.save();
            return res.status(httpStatus.OK).json({message: "User authenticated successfully !!!", token, username: user.username})
        }
        else{
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Invalid credentials. Please try again"})
        }

    }
    catch(e){
        return(res.status(500).json({message: `This error occured : ${e}`}))
    }
}

const addUserMeeting = async(req, res)=>{
    try{
        console.log(`Req body : ${JSON.stringify(req.body)}`)
        console.log(`Req params : ${JSON.stringify(req.params)}`)
        let username = req.params.username // get the username from the request string
        const {meetingID, meetingDate} = req.body 
        const newMeeting = new MeetingModel({
            username,
            meetingID,
            meetingDate: meetingDate || Date.now()
        })
        await newMeeting.save()
        res.status(201).json({message: "Meeting details addedd successfully !!!"})

    }   
    catch(e){
        res.status(500).json({message: `This error occured while fetching the user to add the meeting details : ${e}`})
    } 
}

const findUserMeetings = async(req, res)=>{
    try{
        const username = req.params.username
        const meetings = await MeetingModel.find({username})
        res.status(200).json({message: "Meeting details fetched successfully !!!", meetings})        
    }
    catch(e){
        res.status(500).json({message: "There was some server error in fetching the meetings for the given user"})
    }
}

// Function tosearch if the given meeting room exists

const searchMeetings = async(req, res)=>{
    try{
        let roomName = req.params.roomName;
        const room = await MeetingModel.find({roomName})
        if(room){
            res.status(200).json({message : "This meeting room exists.", success : true})
        }
        else{
            res.status(200).json({message : "This meeting room does not exist", success : false})
        }
    }
    catch(e){
        console.log(`This error occured while searching for this meeting room : ${e}`)
    }
}

export {registerUser, authenticateUser, addUserMeeting, findUserMeetings, searchMeetings}
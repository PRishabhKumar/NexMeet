import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
    meetingID: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    meetingPassword: {
        type: String,
        required: false,
        unique: true
    },
    meetingDate: {
        type: Date,
        default: Date.now(),
        required: true,
    }
})

// Creating the model 

const MeetingModel = mongoose.model("Meeting", MeetingSchema);

export {MeetingModel}


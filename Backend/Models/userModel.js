import mongoose, { mongo } from "mongoose"

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        emailID: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            unique: true
        },
        token: {
            type: String
        }
    }    
)

// Creating the model
const User = mongoose.model("User", userSchema); // here we know that the name of the models will be changed to users in the actual DB

export {User}
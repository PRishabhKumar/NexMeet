import {Router} from "express"
import {registerUser, authenticateUser, findUserMeetings, addUserMeeting} from "../Controllers/UserController.js"

const router = Router();


router.route("/login").post(authenticateUser)
router.route("/register").post(registerUser)
router.route("/add_activity/:username").post(addUserMeeting)
router.route("/get_activities/:username").get(findUserMeetings)

export default router;
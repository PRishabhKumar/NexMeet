import {Router} from "express"
import {registerUser, authenticateUser} from "../Controllers/UserController.js"

const router = Router();


router.route("/login").post(authenticateUser)
router.route("/register").post(registerUser)
router.route("add_activity")
router.route("/get_activities")

export default router;
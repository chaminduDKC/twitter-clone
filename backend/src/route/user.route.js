import express from "express";
import { getUserProfile, deleteUser, updateUser, syncUser, followUser } from "../controller/user.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/get-user/:username", getUserProfile);


router.delete("/delete-user",protectedRoute, deleteUser);
router.post("sync-user", protectedRoute, syncUser);
router.put("/update-user", protectedRoute, updateUser);
router.post("/follow/:targetUserId",protectedRoute, followUser);

export default router;
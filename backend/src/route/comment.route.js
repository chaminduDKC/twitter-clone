import express from "express";
import {createComment, deleteComment, getComments} from "../controller/comment.controller.js";
import {protectedRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/post/:postId", getComments)


router.post("/post/:postId", protectedRoute, createComment)
router.delete("/:commentId", protectedRoute, deleteComment)

export default router;
import express from "express";
import {getPost, likePost, getPosts, getUserPosts, createPost, deletePost, commentPost} from "../controller/post.controller.js";
import {protectedRoute} from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// visitor routes
router.post("/", getPosts)
router.post("/:postId", getPost)
router.post("/users/:username", getUserPosts)

// protected routes
router.post("/create", protectedRoute, upload.single("image"),  createPost);
router.post("/:postId/like", protectedRoute, likePost);
router.post("/:postId/comment", protectedRoute, commentPost);
router.delete("/:postId", protectedRoute, deletePost);


export default router;
import Comment from "../model/comment.model.js";
import {getAuth} from "@clerk/express";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import Notification from "../model/notification.model.js";
import {isValidObjectId} from "mongoose";


export const getComments = async (req, res)=>{
    try{
        const {postId} = req.params;
        if(!postId) return res.status(400).json({error:"Post ID is required"});
        const comments = await Comment.find({post:postId}).sort({createdAt: -1})
            .populate("user", "username firstName lastName profilePicture")

        if(comments.length === 0) return res.status(200).json({error:"No comments found. Empty array"});
        if(!comments) return res.status(404).json({error:"No comments found"});


        res.status(200).json({comments});
    } catch (e) {
        console.log("Error in getting comments", e);
        return res.status(500).json({error:"Internal Server Error"});
    }

}

export const createComment = async (req, res)=>{

    try {
        const {content} = req.body;
        const {userId} = getAuth(req);
        if(!userId) return res.status(401).json({error:"Unauthorized"});
        if(!content || content.trimEnd() === "")return res.status(400).json({error:"bad request. Empty comment"});
        const {postId} = req.params;
        if(!postId) return res.status(400).json({error:"Post ID is required"});

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({error:"No post found"});

        const user = await User.findOne({clerkId: userId})
        if(!user) return res.status(404).json({error:"No user found"});
        const newComment =await Comment.create({
            user:user._id,
            post:postId,
            content
        });

        await Post.findOneAndUpdate(postId, {
            $push:{comments:newComment._id}
        })

        if(user._id.toString() !== post.user.toString()){
            await Notification.create({
                from:user._id,
                to:post.user,
                type:"comment",
                post:post
            })
        }
        res.status(201).json({message:"Comment created successfully", comment:newComment})
    } catch (e) {
        console.log("Error in creating comments", e);
        return res.status(500).json({error:"Internal Server Error"})
    }
}

export const deleteComment = async (req, res)=>{
    try {
        const {commentId} = req.params;
        const {userId} = getAuth(req);
        const user = await User.findOne({clerkId: userId})
        const comment = await Comment.findById(commentId);
        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        if (!commentId) return res.status(400).json({ error: "Comment ID is required" });

        if (!isValidObjectId(commentId)) return res.status(400).json({ error: "Invalid comment ID" });

        if(user._id.toString() !== comment.user.toString()){
            return res.status(403).json({error:"You are not authorized to delete this comment"})
        }
        await Post.findOneAndUpdate(commentId, {
            $pull:{comments:commentId}
        })

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({message:"Comment deleted successfully"})
    } catch (e) {
        console.log("Error in deleting comments", e);
        return res.status(500).json({error:"Internal Server Error"})
    }
}
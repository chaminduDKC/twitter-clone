import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import {getAuth} from "@clerk/express";
import cloudinaryConfig from "../config/cloudinary.config.js";
import Notification from "../model/notification.model.js";
import Comment from "../model/comment.model.js";

export const getPosts = async (req, res)=>{
    try{
        const posts = await Post.find().sort({createdAt: - 1})
            .populate("user", "username firstName lastName profilePicture")
            .populate({
                path:"comments",
                populate:{
                    path:"user",
                    select:"username firstName lastName profilePicture"
                }
            })
        res.status(200).json({ posts })
    } catch (e) {
        res.status(500).json({message:"Internal Server Error", e})
    }

};

export const getPost = async (req, res)=>{
    try {
        const { postId } = req.params;
        if(!postId) return res.status(404).json({message:"Post id not found"});

        const post = await Post.findById(postId)
            .populate("user", "username firstName lastName profilePicture")
            .populate({
                path:"comments",
                populate:{
                    path:"user",
                    select:"username firstName lastName profilePicture"
                }
            })
        if(!post) return res.status(404).json({message:"Post not found"});
        res.status(200).json({post});
    } catch (e) {
        res.status(500).json({message:"Internal Server Error", e})
    }


};

export const getUserPosts = async (req, res)=>{
    try {
    const { username } = req.params;
    if(!username) return res.status(404).json({message:"Username not found"});
    const user = await User.findOne({ username });
    if(!user) return res.status(404).json({message:"User not found"});
    const posts = await Post.find({user:user._id})
        .sort({createdAt:-1})
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path:"comments",
            populate:{
                path:"user",
                select:"username firstName lastName profilePicture"
            }
        })

    if(!posts) return res.status(404).json({message:"Posts not found"});
    if(posts.length === 0) return res.status(200).json({message:"Posts are zero"});

    res.status(200).json(posts)

    } catch (e) {
        res.status(500).json({message:"Internal Server Error", e})
    }
};

export const createPost = async (req, res)=>{
    try {
        const {userId} = getAuth(req);
        if(!userId) return res.status(404).json({message:"User id not found or Unauthorized"})

        const { content } = req.body;
        const imageFile = req.file;

        if(!content || !imageFile){
            return res.status(400).json({error:"Empty post"})
        }

        const user = await User.findOne({clerkId: userId});
        if(!user) return res.status(404).json({error:"User Not Exist"})

        let imageUrl = "";
        const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
            "base64"
        )}`;
        const uploadResponse = await cloudinaryConfig.uploader.upload(base64Image, {
            folder:"social_media_posts",
            resource_type:"image",
            transformation:[
                { width:800, height:600, crop:"limit" },
                { quality:"auto" },
                { format:"auto" },
            ]
        });
        imageUrl = uploadResponse.secure_url;

        const post = await Post.create({
            user:user._id,
            content:content || "",
            image:imageUrl
        });

        res.status(201).json({post});
    } catch (uploadError) {
        console.error("cloudinary error or unknown error "+uploadError)
        return res.status(400).json({error:"Failed to upload" + uploadError})
    }
};

export const likePost = async (req, res)=>{
    try{
        const { postId } = req.params;
        if(!postId) return res.status(404).json({error:"Post id not found"});
        const {userId} = getAuth(req);
        const post = await Post.findById(postId);
        const user = await User.findOne({clerkId: userId})

        if(!post) return res.status(404).json({error:"Post not found"});
        if(!user) return res.status(404).json({error:"User not found"});

        const isLiked = post.likes.includes(user._id);
        if(isLiked){
            await Post.findByIdAndUpdate(postId, {
                $pull:{likes:user._id}
            });
        } else {
            await Post.findByIdAndUpdate(postId, {
                $push:{likes:user._id}
            });

            if(post.user.toString() !== user._id.toString()){
                await Notification.create({
                    from:user._id,
                    to:post.user,
                    type:"like",
                    post:postId
                });
            }
        }
        res.status(200).json({
            message:isLiked ? "Post unliked" : "Post liked"
        });
    } catch (e) {
        res.status(500).json({message:"Internal Server Error", e})
    }

};

export const commentPost = async (req, res)=>{
    try{
        const {userId} = getAuth(req);
        const {postId} = req.params;
        const {content} = req.body;
        if(!userId || !postId || !content) return res.status(400).json({error:"Bad Request. Some fields are missing"})

        const post = await Post.findById(postId);
        const user =await User.findOne({clerkId: userId})

        if(!user || !post) return res.status(404).json({error:"User or Post not found"})

        const comment = await Comment.create({
            user:user._id,
            post:postId,
            content
        })
        await Post.findOneAndUpdate(postId, {
            $push:{comments:comment._id}
        })

        if(user._id.toString() !== post.user.toString()){
            await Notification.create({
                from:user,
                to:post.user,
                type:"comment",
                post:post
            })
        }
        res.status(200).json({
            message:"commented on your post"
        });
    } catch (e) {
        res.status(500).json({message:"Internal Server Error", e})
    }

};

export const deletePost = async (req, res)=>{
    try{
        const {postId} = req.params;
        const {userId} = getAuth(req);

        if(!postId || !userId) return res.status(404).json({error:"post id or user id not found"});

        const user = await User.findOne({clerkId: userId});
        const post =  await Post.findById(postId);
        if(!post || !user) return res.status(404).json({error:"post or user not found"});

        if(post.user.toString() !== user._id.toString()){
            return res.status(403).json({error:"Unauthorized. Can not be deleted other posts"});
        }
        await Comment.deleteMany({post:postId})

        await Post.findByIdAndDelete(postId);
        res.status(200).json({message:"Post deleted successfully"});
    } catch (e){
        res.status(500).json({message:"Internal Server Error", e})
    }

};
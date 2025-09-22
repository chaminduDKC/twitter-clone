import { clerkClient, getAuth } from "@clerk/express";
import User from "../model/user.model.js";
import Notification from "../model/notification.model.js";

export const getUserProfile = async (req, res) => {

    try {
        const { username } = req.params;
        
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: `Internal server error. ${error}`});
    }

}
export const deleteUser = async (req, res) => {
    const { userId } = getAuth(req);
    try {
        const user = User.findOneAndDelete({ clerkId:userId });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: `Internal server error. ${error}`});
    }
}

export const updateUser = async (req, res) => {
    const {userId} = getAuth(req);

    const user = await User.findByIdAndUpdate({clerkId:userId}, req.body, {new:true});
    if(!user) return res.status(404).json({error:"User not found"});
    res.status(200).json({message:"User Updated Done"});
}

export const syncUser = async(req, res)=>{
    const {userId} = getAuth(req);
    const existingUser = await User.findOne({clerkId:userId});
    if(existingUser) return res.status(200).json({message:"User already exists"});
   

    const clerkUser = await clerkClient.users.getUser(userId);
    const newUserData = {
        clerkId:userId,
        email:clerkUser.emailAddresses[0]?.emailAddress,
        firstName:clerkUser?.firstName,
        lastName:clerkUser?.lastName,
        username:clerkUser.emailAddresses[0]?.emailAddress.split("@")[0],
        profilePicture:clerkUser?.imageUrl || ""
    }
    await User.create(newUserData);
    res.status(201).json({message:"User synced successfully"});
}
export const followUser = async (req, res)=>{
    const {userId} = getAuth(req);
    const {targetUserId} = req.params;

    if(userId === targetUserId) return res.status(400).json({error:"You cannot follow yourself"});

    const currentUser = await User.findOne({clerkId:userId});
    const targetUser = await User.findOne({clerkId:targetUserId});
    if(!currentUser || !targetUser) return res.status(404).json({error:"User not found"});

    const isFollowing =currentUser.following.includes(targetUserId);
    if(isFollowing){
        // unfollow
        await User.findOneAndUpdate(userId, {$pull:{following:targetUserId}});
        await User.findByIdAndUpdate(targetUserId, {$pull:{followers:userId}});
    } else {
        // follow
        await User.findOneAndUpdate(userId, {$push:{following:targetUserId}});
        await User.findOneAndUpdate(targetUserId, {$push:{followers:userId}});
        // send notifi
        await Notification.create({
            from:userId,
            to:targetUserId,
            type:"follow"
        });
    }
    res.status(200).json({message:isFollowing ? "User unfollowed successfully" : "User followed successfully"});
};
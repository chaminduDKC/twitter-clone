import {getAuth} from "@clerk/express";
import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";

export const getNotifications = async (req, res)=>{
    try {
        const { userId } = getAuth(req);

        const user = await User.findOne({clerkId: userId});
        if(!userId) return res.status(401).json({error:"Unauthorized"});

        const notifications = await Notification.find({to: user._id}).sort({createdAt:-1})
            .populate("from", "username firstName lastName profilePicture")
            .populate("post", "content image")
            .populate("comment", "content")

        res.status(200).json({notifications});
    } catch (error) {
        res.status(500).json({ error: `Internal server error. ${error}` });
    }

}

export const deleteNotification = async (req, res)=>{
    try {
        const {notificationId} = req.params;
        const {userId} = getAuth(req);
        if(!notificationId) return res.status(400).json({error:"Notification ID is required"});
        if(!userId) return res.status(401).json({error:"Unauthorized"});
        const user = await User.findOne({clerkId: userId})
        const notification = await Notification.findById(notificationId);
        if(user && notification){
            if(notification.to.toString() === user._id.toString()){
                await Notification.findByIdAndDelete(notificationId);
                return res.status(200).json({message:"Notification deleted successfully"});
            }
            return res.status(403).json({error:"Forbidden. You can not delete others notification"});
        }
        return res.status(404).json({error:"User or Notification not found"});
    } catch (err){
        res.status(500).json({ error: `Internal server error. ${err}` });
    }

}
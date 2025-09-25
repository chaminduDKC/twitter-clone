import express from "express";
import {deleteNotification, getNotifications} from "../controller/notification.controller.js";
import {protectedRoute} from "../middleware/auth.middleware.js";

const route = express.Router();

route.get("/", protectedRoute, getNotifications)
route.get("/:notificationId", protectedRoute, deleteNotification)
export default route;
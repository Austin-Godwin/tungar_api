import { Router } from "express";
import RequestAuth from '../middleware/auth';
import Blog from "./blog";
import TodoRoute from "./todo";
import UserRoute from "./user";
const route = Router();


route.use("/user", UserRoute);

route.use(RequestAuth);

route.use("/todo", TodoRoute);

route.use("/blog",Blog);



export default route;

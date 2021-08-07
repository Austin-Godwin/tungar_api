import { Router } from "express";
import BlogController from "../controller/blog";

const route = Router();




route.get("/posts/:limit?", BlogController.get_posts);
route.post("/like", BlogController.like);
route.post("/post", BlogController.post);


export default route;

import { Router} from "express";
import BlogController from "../controller/blog";

const route = Router();




route.post("/post",BlogController.post);


export default route;




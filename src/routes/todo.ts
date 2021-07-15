import { Router } from "express";
import { TodoController } from "../controller/todo";


const route = Router();


route.get("/get/:id", TodoController.get);
route.get("/author/:author", TodoController.getByAuthor);
route.get("/list", TodoController.getAll);

route.post("/add", TodoController.create);
route.post("/add/many", TodoController.create_many);

export default route;

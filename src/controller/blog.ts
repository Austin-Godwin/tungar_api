import { Request, Response } from "express";
import { SuccessResult } from "../middleware/response";
import Blog from "../modules/blog";


export default class BlogController {









    static async post(req: Request, res: Response) {

        const { author, content } = req.body;

        const data = await Blog.post({ content, author });


        return res.status(201).send(SuccessResult("Success", 201, data));

    }


    static async get_posts(req: Request, res: Response) {

        const { limit } = req.params ?? req.query;

        const data = await Blog.list({ limit: Number(limit) });

        return res.status(201).send(SuccessResult("Success", 200, data));

    }




    static async like(req: Request, res: Response) {

        const { postId, userId } = req.body;

        const data = await Blog.like(userId, postId);

        return res.status(201).send(SuccessResult("Success", 200, data));
    }








}
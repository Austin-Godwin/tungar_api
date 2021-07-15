import { Request, Response, NextFunction } from 'express';
import { UnAuthorized } from './error_handler';
import jwt from "jsonwebtoken";




export default function RequestAuth(req: Request, res: Response, next: NextFunction) {
 
          const token = req.headers.authorization;

          if (!token) return next(new UnAuthorized());

          jwt.verify(token, "temp", (err, data) => {

               // check for errors
               if (err) return next(new UnAuthorized());

               (req as any).user = data;

               next();
          });

}

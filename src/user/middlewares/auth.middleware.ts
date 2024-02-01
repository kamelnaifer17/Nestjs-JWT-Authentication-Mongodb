import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request,Response,NextFunction } from "express";
import { User } from "../user.schema";
import { verify } from "jsonwebtoken";
import { UserService } from "../user.service";

export interface ExpressRequest extends Request {
    user?: User 
}

@Injectable()
export class AuthMidlleware implements NestMiddleware{
    constructor(private readonly userservice:UserService){}
    async use(req:ExpressRequest,res:Response,next:NextFunction){
        if (!req.headers ['authorization']){
            req.user = null
            next()
            return
        }
const token = req.headers['authorization'].split(' ')[1]
 try{
    const decode=verify(token,'process.env.JWT_SECRET') as {email:string}
    const user = await this.userservice.findByEmail(decode.email)
    req.user = user
    next()
 }catch(err){
    req.user=null
    next()
 }
    }
}
import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {UserResponseType} from './types/userResponse.type';
import { LoginDto } from './dto/login.dto';
import { ExpressRequest } from './middlewares/auth.middleware';
import { Request } from '@nestjs/common';


@Controller()
export class UserController {

    constructor( private readonly userservice:UserService){}

    @Post('users')
    async createUser(@Body()createuserdto:CreateUserDto):Promise<UserResponseType>{
        const user = await this.userservice.createuser(createuserdto)
        return this.userservice.builUserResponse(user)
    }

     @Post('users/login')
    async login(@Body()loginDto:LoginDto):Promise<UserResponseType>{
        const user = await this.userservice.loginUser(loginDto)
        return this.userservice.builUserResponse(user)
    }

    @Get('user')
    async currentUser(@Request() request:ExpressRequest):Promise<UserResponseType>{
    if(!request.user){
        throw new HttpException('Unauthorized',HttpStatus.UNAUTHORIZED)
    }
    return this.userservice.builUserResponse(request.user)
    }


}

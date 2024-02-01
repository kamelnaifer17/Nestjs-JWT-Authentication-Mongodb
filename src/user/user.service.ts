import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseType } from './types/userResponse.type';
import { LoginDto } from './dto/login.dto';
import {compare} from 'bcrypt';
import {sign} from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(@InjectModel (User.name) private userModel:Model<User>){}

    async createuser(createuserdto:CreateUserDto):Promise<any> {
        const user = await this.userModel.findOne({email:createuserdto.email})
    
        if (user){
            throw new HttpException ('Email is already taken',HttpStatus.UNPROCESSABLE_ENTITY)
        }
    
    const createdUser = new this.userModel(createuserdto)
    return createdUser.save()
}

   async loginUser(loginDto:LoginDto){
    const  user = await this.userModel.findOne({email:loginDto.email}).select('+password')
    if (!user){
        throw new HttpException ('User Not Found',HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const isPasswordCorrect = await compare(loginDto.password,user.password)
   
   if (!isPasswordCorrect){
    throw new HttpException ('Incorrect Password',HttpStatus.UNPROCESSABLE_ENTITY)
}
return user
}

builUserResponse(user:User):UserResponseType{
    return {
        name:user.name,
        email:user.email,
        token:this.generatejwt(user)
    }
}
generatejwt(user:User):string{
return sign({email:user.email},process.env.JWT_SECRET)
}
async findByEmail(email:string):Promise<User>{
return this.userModel.findOne({email})
}
} 

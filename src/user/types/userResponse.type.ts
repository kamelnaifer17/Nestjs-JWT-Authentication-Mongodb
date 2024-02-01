import { User } from "../user.schema";

export type UserResponseType = Omit <User,'password'>& {token:string}
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtPayloadDto } from "./dto/jwt-payload.dto";
import { JwtService } from "@nestjs/jwt";
import { GoogleUserDto } from "./dto/google-user.dto";
import { userDto } from "./dto/user-dto";

@Injectable()
export class AuthService{
    constructor(private readonly prisma:PrismaService,private readonly jwtService:JwtService){}

    async validateOrCreateUser(googleUserDto:GoogleUserDto){
        let user = await this.prisma.user.findUnique({where:{googleId:googleUserDto.googleId}})
        if(!user){
            user = await this.prisma.user.create({data:googleUserDto})
        }
        return user
    }   

    async generateJwt(user:userDto){
        const payload:JwtPayloadDto = {googleId:user.googleId,userId:user.id}
        return {token:this.jwtService.sign(payload)}
    }
    
    async findUser(id:string){
        return await this.prisma.user.findUnique({where:{id},include:{urls:true}})
    }

}
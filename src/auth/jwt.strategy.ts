import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayloadDto } from "./dto/jwt-payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromExtractors([
                (req:Request)=>{
                    const rowtoken = req.headers?.cookie?.split("jwt.connect.sid=")?.[1];
                    const token =  rowtoken?.includes(";")?rowtoken.split(";")[0]:rowtoken;
                    return token
                }
            ]),
            ignoreExpiration:false,
            secretOrKey:process.env.JWT_SECRET,
        });
    }
    async validate(payload:JwtPayloadDto){
        return payload
    }
}
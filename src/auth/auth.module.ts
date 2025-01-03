import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./google.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports:[PassportModule,JwtModule.register({secret:process.env.JWT_SECRET,signOptions:{expiresIn:'7d'}})],
    providers:[GoogleStrategy,PrismaService,AuthService,JwtStrategy],
    controllers:[AuthController]
})
export class AuthModule{}
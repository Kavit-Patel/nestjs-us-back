import { Controller, Get, NotFoundException, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(){

    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req:any,@Res() res:any){
        const googleUser = req.user;
        if(!googleUser){
            throw new NotFoundException()
        }
        const user = await this.authService.validateOrCreateUser(googleUser)
        const {token} = await this.authService.generateJwt(user)
        res.cookie('jwt.connect.sid',token,{
            path:"/",
            sameSite:process.env.NODE_ENV==="production"?"none":"lax",
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            maxAge:7*24*24*60*1000,
        })
        res.redirect(process.env.FRONTEND_URL)
    }

    @Get('user')
    @UseGuards(AuthGuard('jwt'))
    async userlogin(@Req() req:any){
        const userId = req.user?.userId
        if(!userId){
            throw new UnauthorizedException()
        }
        const user = await this.authService.findUser(userId)

        return user
    }
    @Get('logout')
    async userlogout(@Res() res:any){
        res.clearCookie('jwt.connect.sid',{
            path: '/', 
            secure: process.env.NODE_ENV==="production",
            sameSite: process.env.NODE_ENV==="production"?"none":"lax",
          })
        res.redirect('/')
    }
}
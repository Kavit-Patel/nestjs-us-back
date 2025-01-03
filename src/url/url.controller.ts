
import {
    Body,
    Controller,
    Get,
    Headers,
    Ip,
    Param,
    Post,
    Redirect,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
  } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlService } from './url.service';
import { ApiHeader, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
  
  @Controller()
  export class UrlsController { 
    constructor(private readonly urlService: UrlService) {}
  
    @UseGuards(AuthGuard('jwt'))
    @Post('shorten')
    @ApiOperation({ summary: 'Create a short URL for a given long URL.' })
  @ApiResponse({
    status: 201,
    description: 'Short URL successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized if the user is not logged in.',
  })
    async createShortUrl(@Req() req,@Body() createUrlDto: CreateUrlDto) {
      const user:string = req.user?.userId
      if(!user){
         throw new UnauthorizedException("You are not authorized !")
      }
      return this.urlService.createShortUrl(user,createUrlDto);
    }
  
    @Get(':alias')
    @Redirect()
    @ApiOperation({ summary: 'Redirect to the original long URL using the alias.' })
  @ApiParam({
    name: 'alias',
    required: true,
    description: 'The alias for the short URL.',
    example: 'google',
  })
  @ApiHeader({
    name: 'user-agent',
    description: 'The User-Agent header of the client making the request.',
    required: false,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to the long URL.',
  })
  @ApiResponse({
    status: 404,
    description: 'Alias not found or invalid.',
  })
    async redirectToLongUrl(@Res() res,@Param('alias') alias: string,@Ip() ip:string,@Headers('user-agent') userAgent:string|undefined) {
      if(ip==="::1" || ip.includes("ffff")){
        ip = "127.0.0.1"
      }
      const longUrl = await this.urlService.redirectToLongUrl(alias,ip,userAgent||"unknown");
      return {url:longUrl,statusCode:302}
    }

  @UseGuards(AuthGuard('jwt'))
  @Get('url/:id')
  @ApiParam({
    name:'id',
    required:true,
    description:'Id of the url to be deleted !',
    example:'cl9t2j67e0000xk5d8yhpksv7'
  })
  @ApiResponse({
    status:200,
    description:'URL and related references deleted successfully.'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized if the user is not logged in.',
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found.',
  })
  async deleteUrlById(@Req() req,@Param('id') id:string){
    const userId = req.user?.userId;
    if(!userId){
      throw new UnauthorizedException('You are not authorized !')
    }
    return await this.urlService.deleteUrlById(userId,id)
  }
  }
  
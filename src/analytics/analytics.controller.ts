import { Controller, Get, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UrlAnalyticsResponseDto } from './dto/url-analytics.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('analytics/:alias')
  @ApiOperation({ summary: 'Get analytics for a specific URL alias' })
  @ApiParam({
    name: 'alias',
    description: 'Alias of the URL for which analytics are required',
    example: 'short-url-alias',
  })
  @ApiResponse({
    status: 200,
    description: 'URL analytics data',
    type: UrlAnalyticsResponseDto,
  })
  async getUrlAnalytics(@Req() req,@Param('alias') alias: string) {
    const userId = req.user?.userId
    if(!userId){
      throw new UnauthorizedException('You are not authorized !')
    }
    return this.analyticsService.getUrlAnalytics(alias,userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('analytics/topic/:topic')
  @ApiOperation({ summary: 'Get analytics for a specific topic' })
  @ApiParam({
    name: 'topic',
    description: 'Topic name for which analytics are required',
    example: 'search-engine / retention',
  })
  @ApiResponse({
    status: 200,
    description: 'Topic analytics data',
  })
  async getTopicAnalytics(@Req() req,@Param('topic') topic: string) {
    const userId = req.user?.userId
    if(!userId){
      throw new UnauthorizedException('You are not authorized !')
    }
    return this.analyticsService.getTopicAnalytics(topic,userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/overall/')
  @ApiOperation({ summary: 'Get overall analytics across all data' })
  @ApiResponse({
    status: 200,
    description: 'Overall analytics data',
  })
  async getOverallAnalytics(@Req() req) {
    const userId = req.user?.userId
    if(!userId){
      throw new UnauthorizedException('You are not authorized !')
    }
    return this.analyticsService.getOverallAnalytics(userId);
  }
}
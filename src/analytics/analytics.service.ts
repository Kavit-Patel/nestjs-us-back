import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { extractDevice, extractOS } from 'src/url/url.utils';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUrlAnalytics(alias: string,userId:string) {
    const url = await this.prisma.url.findUnique({
      where: { alias,userId },
      include: { analytics: true,clicks:true },
    });
    if (!url) {
      throw new NotFoundException("Not found in your collection !");
    }
    const totalClicks = url.analytics?.reduce((prev,curr)=>prev+curr.clicks,0)
    const uniqueClicks= new Set(url.clicks.map(click=>click.ipAddress)).size ||0;
    const recent7DaysStats = Array.from({length:7}).map((_,idx)=>{
      const today = new Date();
      today.setDate(today.getDate()-idx);
      return {
        date:today.toISOString().split('T')[0],
        clickCount:url.clicks.filter(click=>new Date(click.createdAt).toISOString().split('T')[0]===today.toISOString().split('T')[0]).length
      }
    });
    const osTypeDeviceType = url.analytics.flatMap(analytic=>{
      const osName = analytic.osName
      const deviceName = analytic.deviceName
      return [{
        osName,
        uniqueClicks:url.analytics.reduce((prev,curr)=>curr.osName===osName?prev+curr.uniqueVisits:prev,0)||0,
        uniqueUsers:url.clicks.filter(click=>extractOS(click.userAgent)===osName).length||0
      },{
        deviceName,
        uniqueClicks:url.analytics.reduce((prev,curr)=>curr.deviceName===deviceName?prev+curr.clicks:prev,0)||0,
        uniqueUsers:url.clicks.filter(click=>extractDevice(click.userAgent)===deviceName).length||0
      }]
    })

    const osType = osTypeDeviceType.filter(type=>type.osName)
    const deviceType = osTypeDeviceType.filter(type=>type.deviceName)
    return {
      totalClicks,uniqueUser:uniqueClicks,clicksByDate:recent7DaysStats,osType,deviceType
    }

  }

  async getTopicAnalytics(topic: string,userId:string) {
    const topicUrls = await this.prisma.topic.findMany({where:{name:topic,urls:{some:{userId}}},include:{urls:{where:{userId},include:{analytics:true,clicks:true}}}});
    if(topicUrls.length===0){
      throw new NotFoundException("Not found in your collection !")
    }
    const urls = topicUrls.flatMap(topic=>topic.urls)
    const totalClicks= urls.flatMap(url=>url.analytics).reduce((prev,curr)=>prev+curr.clicks,0);
    const uniqueUsers= new Set (urls.flatMap(url=>url.clicks).map(click=>click.ipAddress)).size ||0;
    const clicksByDate= Array.from({length:7}).map((_,idx)=>{
      const today = new Date();
      today.setDate(today.getDate()-idx);
      return {
        date:today.toISOString().split('T')[0],
        clickCount:urls.flatMap(url=>url.clicks).filter(click=>click.createdAt.toISOString().split('T')[0]===today.toISOString().split('T')[0]).length
      }
    })
    const urlsStats = urls.map(topic=>{

      const currentShortUrl = topic.shortUrl;
      const totalClicks = topic.analytics.reduce((prev,curr)=>prev+curr.clicks,0)
      const uniqueUsers = new Set(topic.clicks.map(click=>click.ipAddress)).size;
      return {
        shortUrl:currentShortUrl,
        totalClicks,
        uniqueClicks:uniqueUsers
      }
    })
    return {
      totalClicks,uniqueUsers,clicksByDate,urls:urlsStats
    }

  }

  async getOverallAnalytics(userId:string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        urls: {
          include: {
            analytics: true,
            clicks: true,
          },
        },
      },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    const analytics = user.urls.flatMap((url) => url.analytics);
  
    const osType = analytics.reduce((acc, analytic) => {
      const existingOs = acc.find((item) => item.osName === analytic.osName);
      if (existingOs) {
        existingOs.uniqueClicks += analytic.clicks;
        existingOs.uniqueUsers += analytic.uniqueVisits;
      } else {
        acc.push({
          osName: analytic.osName,
          uniqueClicks: analytic.clicks,
          uniqueUsers: analytic.uniqueVisits,
        });
      }
      return acc;
    }, [] as { osName: string; uniqueClicks: number; uniqueUsers: number }[]);
  
    const deviceType = analytics.reduce((acc, analytic) => {
      const existingDevice = acc.find((item) => item.deviceName === analytic.deviceName);
      if (existingDevice) {
        existingDevice.uniqueClicks += analytic.clicks;
        existingDevice.uniqueUsers += analytic.uniqueVisits;
      } else {
        acc.push({
          deviceName: analytic.deviceName,
          uniqueClicks: analytic.clicks,
          uniqueUsers: analytic.uniqueVisits,
        });
      }
      return acc;
    }, [] as { deviceName: string; uniqueClicks: number; uniqueUsers: number }[]);
  
    const clicksByDate = user.urls.flatMap((url) => {
      const createdAt = url.createdAt;
      const today = new Date();
      const days = Math.ceil((today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
      return {
        url: url.longUrl,
        urlStats: Array.from({ length: days }).map((_, idx) => {
          const date = new Date();
          date.setDate(today.getDate() - idx);
  
          const clickCount = url.clicks.filter(
            (click) =>
              click.createdAt.toISOString().split("T")[0] === date.toISOString().split("T")[0]
          ).length;
  
          return {
            date: date.toISOString().split("T")[0],
            clickCount,
          };
        }),
      };
    });
  
    const usersStats = {
      currentUser: user.name,
      stats: {
        totalUrls: user.urls.length,
        totalClicks: analytics.reduce((sum, analytic) => sum + analytic.clicks, 0),
        uniqueUsers: new Set(user.urls.flatMap((url) => url.clicks.map((click) => click.ipAddress))).size,
        clicksByDate,
        osType,
        deviceType,
      },
    };
  
    return usersStats;
  
  
  }
}
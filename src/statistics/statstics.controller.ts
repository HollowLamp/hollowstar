import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('数据接口')
@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('views')
  @ApiOperation({ summary: '统计所有阅读量' })
  async getAllViews() {
    return this.statisticsService.getAllViews();
  }

  @Get('counts')
  @ApiOperation({ summary: '获取数量统计' })
  async getCounts() {
    return this.statisticsService.getCounts();
  }

  @Get('daily-views')
  @ApiOperation({ summary: '获取指定时间范围的每日阅读量' })
  async getDailyViews(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.statisticsService.getDailyViewsRange(startDate, endDate);
  }

  @Get('monthly-views')
  @ApiOperation({ summary: '获取指定时间范围的每月阅读量' })
  async getMonthlyViews(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.statisticsService.getMonthlyViewsRange(startDate, endDate);
  }

  @ApiOperation({ summary: '获取内容字数统计' })
  @Get('/content-word-count')
  async getContentWordCount() {
    return this.statisticsService.getContentWordCount();
  }
}

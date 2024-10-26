import { Body, Controller, Get, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { TagsDto } from './tags.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return await this.appService.getHello();
  }

  @Get('tags')
  async getTags() {
    return await this.appService.getFullTree();
  }

  @Put('tags')
  async syncTags(@Body() tagDto: TagsDto) {
    return this.appService.syncTags(tagDto);
  }
}

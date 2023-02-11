import { Body, Controller, Get, Post } from '@nestjs/common';
import { MacDTO } from '../mac/dto/mac.dto';
import { CreateTemplateListDTO } from './dto/create-templateList.dto';
import { TemplateListService } from './templateListService';

@Controller('templateList')
export class TemplateListController {
  constructor(private readonly templateListService: TemplateListService) {}
  @Post()
  createTemplate(@Body() templateData: CreateTemplateListDTO) {
    return this.templateListService.createTemplate(templateData);
  }
  @Get()
  getAllTemplateList(@Body() macData: MacDTO) {
    return this.templateListService.getAllTemplateList(macData);
  }
}

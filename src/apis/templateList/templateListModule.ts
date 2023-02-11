import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mac } from '../mac/entities/mac.entity';
import { TemplateList } from './entities/templateList.entity';
import { TemplateListController } from './templateListController';
import { TemplateListService } from './templateListService';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateList, Mac])],
  controllers: [TemplateListController],
  providers: [TemplateListService],
})
export class TemplateListModule {}

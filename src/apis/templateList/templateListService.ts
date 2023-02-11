import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MacDTO } from '../mac/dto/mac.dto';
import { Mac } from '../mac/entities/mac.entity';
import { CreateTemplateListDTO } from './dto/create-templateList.dto';
import { TemplateList } from './entities/templateList.entity';

@Injectable()
export class TemplateListService {
  constructor(
    @InjectRepository(TemplateList)
    private templateListRepository: Repository<TemplateList>,
    @InjectRepository(Mac)
    private macRepository: Repository<Mac>,
  ) {}
  async createTemplate(templateData: CreateTemplateListDTO) {
    const { mac, ...rest } = templateData;
    const result = await this.macRepository.save({ id: mac });
    return await this.templateListRepository.save({
      ...rest,
      mac: result,
    });
  }

  async getAllTemplateList(macData: MacDTO) {
    const result = await this.templateListRepository.find({
      where: { mac: { id: macData.mac } },
      relations: {
        mac: true,
      },
    });
    return result;
  }
}

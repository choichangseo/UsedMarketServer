import { Controller } from '@nestjs/common';
import { ProductsReplyService } from './replyService';

@Controller('/reply')
export class ProductsReplyController {
  constructor(private readonly productsReplyService: ProductsReplyService) {}
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const nestContext = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    return context;
  },
);

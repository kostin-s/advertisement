import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from '../user.entity';

type TypeData = keyof UserEntity;

export const CurrentUser = createParamDecorator(
  (data: TypeData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    return data ? user[data] : user;
  },
);

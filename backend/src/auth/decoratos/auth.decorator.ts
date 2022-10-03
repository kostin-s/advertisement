import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { TypeRole } from '../auth.interface';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Auth = (...roles: TypeRole[]) =>
  applyDecorators(
    roles.length
      ? UseGuards(JwtAuthGuard, new RolesGuard(roles))
      : UseGuards(JwtAuthGuard),
  );

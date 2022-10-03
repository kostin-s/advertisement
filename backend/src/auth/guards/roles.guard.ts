import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { UserEntity } from 'src/user/user.entity';
import { TypeRole } from '../auth.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: TypeRole[]) {
    this.roles = roles;
  }

  canActivate(context: ExecutionContext): boolean {
    if (!this.roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: UserEntity }>();
    const user = request.user;

    if (!this.roles.includes(user.role as TypeRole)) {
      throw new ForbiddenException('no rights');
    }

    return true;
  }
}

import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLESS } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector:Reflector
  ){}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles:string[] = this.reflector.get(META_ROLESS, context.getHandler())

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if(!validRoles) return true
    if(validRoles.length === 0 ) return true

    if(!user) 
      throw new BadRequestException('User not found')
    for (let index = 0; index < user.roles.length; index++) {
      if(validRoles.includes(user.roles[index])) return true;  
    }

    throw new ForbiddenException(`User ${user.fullName} need a valid role: [${validRoles}]`)
  }
}

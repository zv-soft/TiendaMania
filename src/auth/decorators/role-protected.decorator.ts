import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
export const META_ROLESS = 'roles'

export const RoleProtected = (...roles: ValidRoles[]) => {
  
  return SetMetadata(META_ROLESS, roles);

}


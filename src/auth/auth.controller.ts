import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Auth, GetUser } from "./decorators";
import { CreateUserDto, LoginUserDto } from "./dto";
import { User } from "./entities/user.entity";
@ApiTags('Auth')
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("singup")
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("singin")
  singin(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Auth()
  @Get("checkAuthStatus")
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}

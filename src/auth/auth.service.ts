import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly jwtService:JwtService
  ){}

  async create(createUserDto: CreateUserDto) {

    try{
    const {password, ...userData} = createUserDto
    
    const user = this.userRepository.create({...userData, password:bcrypt.hashSync(password, 10)}); 

    await this.userRepository.save(user);

    return {
      ...user,
      token: this.getJwt({email:user.email, id:user.id})
    };
    }
    catch(err)
    {
      this.handleDbError(err)
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const {password, email} =  loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password:true, id:true, fullName:true, isActive:true}
    })

    if(!user || !bcrypt.compareSync(password, user.password)) 
      throw new UnauthorizedException(`invalid Credentials`)

    if(!user.isActive)
      throw new UnauthorizedException('User is Inactive')

    delete user.password 

    return {
      ...user,
      token: this.getJwt({email:user.email, id:user.id})
    };    
  }

  async checkAuthStatus(user:User){  

    if(!user.isActive)
    throw new UnauthorizedException('User is Inactive')

    return {
      ...user,
      token: this.getJwt({email:user.email, id:user.id})
    }; 

  }

  private getJwt( payload: JwtPayload)
  {
    const token = this.jwtService.sign(payload);
    return token;
  }

  /**
   * This function handle Errors
   * 
   * @param error 
   * 
   */
  private handleDbError(error:any):never{
    if(error.code == 23505)
      throw new BadRequestException(error.detail)

    throw new InternalServerErrorException('Plase check server logs')
  }



}

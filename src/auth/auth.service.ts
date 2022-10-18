import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {

    try{
    const {password, ...userData} = createUserDto
    
    const user = this.userRepository.create({...userData, password:bcrypt.hashSync(password, 10)}); 

    await this.userRepository.save(user);

    delete user.password 

    return user;
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
      select: {email: true, password:true}
    })

    if(!user || !bcrypt.compareSync(password, user.password)) 
      throw new UnauthorizedException(`invalid Credentials`)


    return user;

    //TODO: RETURN JWT
    
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

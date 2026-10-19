import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'

import { CreateUserDto, LoginUserDto } from './dto';
import e from 'express';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData} = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };

    } catch (error) {
      this.handleDBError(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {

      const {email, password} = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: { id: true, email: true, password: true, fullName: true, roles: true },
      });

      if (!user || !bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Invalid credentials');

      const { password: _, ...safeUser } = user;

      return {
        user: safeUser,
        token: this.getJwtToken({id: user.id})
      };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBError(error: any): never {
    if (error.code = '23505')
      throw new BadRequestException(error.detail);

    console.log(error)
    throw new BadRequestException('Please check server logs');
  }
}

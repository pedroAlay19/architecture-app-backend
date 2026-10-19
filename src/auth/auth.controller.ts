import { Controller, Post, Body, Get, UseGuards, SetMetadata} from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/get-rawHeaders';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute (
    @GetUser('fullName') fullName: string,
    @RawHeaders() rawHeaders: string[]
    // @Req() req: Express.Request 
  ) {
    // console.log({user: req.user});
    return {
      ok: true,
      message: 'Hola mundo',
      fullName,
      rawHeaders
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.user, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute2 (
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.user)
  testingPrivateRoute3 (
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }
}

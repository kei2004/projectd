// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
       return this.authService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() req: CreateUserDto) {
    return this.authService.login(req.username, req.password);
  }
}
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto'; 

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { username, password, role } = createUserDto;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // role が無ければ 'student' として登録
    return this.userService.create({ 
      username, 
      password: hashedPassword,
      role: role || 'student' 
    });
  }

  
  async login(username: string, pass: string) {
    const user = await this.userService.findOne(username);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    const payload = { username: user.username, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,      
      username: user.username,
      id: user.id
    };
  }
}
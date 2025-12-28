import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // ユーザー登録
  async signup(username: string, pass: string) {
    const hashedPassword = await bcrypt.hash(pass, 10); // パスワード暗号化
    return this.userService.create({ username, password: hashedPassword });
  }

  // ログイン
  async login(username: string, pass: string) {
    const user = await this.userService.findOne(username);
    if (!user) throw new UnauthorizedException('User not found');

    // パスワード照合
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    // JWT発行
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
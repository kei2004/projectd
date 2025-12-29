// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // ヘッダーの "Authorization: Bearer <token>" からトークンを取り出す設定
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ★重要: AuthModuleで設定した秘密鍵と同じにする
      secretOrKey: 'secretKey123', 
    });
  }

  // トークンが正しかった場合に実行される
  async validate(payload: any) {
    // ここで返した値が、Controllerの @Req() req.user に入ります
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}
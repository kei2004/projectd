import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY_12345', // 本番では環境変数(.env)に隠すこと！
      signOptions: { expiresIn: '60m' }, // 1時間で期限切れ
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
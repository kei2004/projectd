// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',      // docker-composeで設定したもの
      password: 'password',  // docker-composeで設定したもの
      database: 'movedb',    // docker-composeで設定したもの
      entities: [],          // 後でUser entityなどをここに入れる
      autoLoadEntities: true,
      synchronize: true,     // 開発環境のみtrue（自動でテーブル作成）
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
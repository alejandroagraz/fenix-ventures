import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserEntity } from './entity/user.entity';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, ConfigService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

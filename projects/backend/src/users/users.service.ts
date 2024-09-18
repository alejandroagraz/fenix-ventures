import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { PageDto } from '../common/dtos/page.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { UserEntity } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { DetailUserDto } from './dto/detail-user.dto';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
    const queryBuilder = this._userRepository.createQueryBuilder('users');

    queryBuilder
      .orderBy('users.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<DetailUserDto> {
    try {
      const user = await this._userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: id })
        .getOne();

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async create(data: CreateUserInput): Promise<UserDto> {
    const createUser = new UserEntity();

    createUser.name = data.name;
    createUser.lastname = data.lastname;
    createUser.dni = data.dni;
    createUser.username = data.username;
    createUser.gender = data.gender;
    createUser.status = data.status;
    createUser.phone = data.phone;
    createUser.address = data.address;
    createUser.email = data.email;
    createUser.password = await hash(data.password, 10);

    try {
      return await this._userRepository.save(createUser);
    } catch (e) {
      if (e.code == 23505)
        throw new HttpException(
          'Email previously registered',
          HttpStatus.NOT_IMPLEMENTED,
        );
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async update(id: string, data: UpdateUserInput): Promise<UserDto> {
    const date: Date = new Date();
    const updateUser = await this.findOneByID(id);

    if (!updateUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    updateUser.name = data.name || updateUser.name;
    updateUser.lastname = data.lastname || updateUser.lastname;
    updateUser.dni = data.dni || updateUser.dni;
    updateUser.username = data.username || updateUser.username;
    updateUser.gender = data.gender || updateUser.gender;
    updateUser.status = data.status || updateUser.status;
    updateUser.phone = data.phone || updateUser.phone;
    updateUser.address = data.address || updateUser.address;
    updateUser.email = data.email || updateUser.email;
    updateUser.updated_at = date;

    try {
      return await this._userRepository.save(updateUser);
    } catch (err) {
      if (err.code == 23505) {
        err.messag = 'Email previously registered';
        throw new HttpException(err.message, HttpStatus.NOT_IMPLEMENTED);
      } else {
        throw new HttpException(err.message, err.status);
      }
    }
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      const isUser = await this.findOneByID(id);

      if (!isUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this._userRepository
        .createQueryBuilder('users')
        .softDelete()
        .from(UserEntity)
        .where('users.id = :id', { id: id })
        .execute();

      return { status: 200, message: 'Success remove user' };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async findOneByID(id: string): Promise<UserEntity> {
    return await this._userRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: id })
      .getOne();
  }

  async findOneUser(username: string): Promise<UserEntity> {
    return await this._userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where(
        new Brackets((qb) => {
          qb.where('user.email = :email', {
            email: username,
          });
          qb.orWhere('user.username = :username', {
            username: username,
          });
        }),
      )
      .getOne();
  }
}

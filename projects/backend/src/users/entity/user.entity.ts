import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, BeforeInsert } from 'typeorm';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '../../common/constants/gender.constant';
import { StatusUser } from '../../common/constants/status-user.constant';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsString()
  lastname: string;

  @Column({ type: 'int', width: 12, nullable: true })
  @IsInt()
  dni: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsString()
  username: string;

  // @Column({
  //   type: 'enum',
  //   enum: Gender,
  //   nullable: true,
  //   default: Gender.MAN,
  // })
  @Column({
    type: 'text',
    nullable: true,
  })
  @IsString()
  gender: Gender;

  // @Column({
  //   type: 'enum',
  //   enum: StatusUser,
  //   nullable: true,
  //   default: StatusUser.ACTIVE,
  // })
  @Column({
    type: 'text',
    nullable: true,
  })
  @IsString()
  status: StatusUser;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  phone: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  @IsString()
  address: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: true, length: 60 })
  @IsString()
  password: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}

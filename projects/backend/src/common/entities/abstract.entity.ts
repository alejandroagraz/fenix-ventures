import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsDate, IsString } from 'class-validator';
import {config} from "dotenv";
import {ConfigService} from "@nestjs/config";

config();
const configService = new ConfigService();

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  @IsDate()
  public created_at: Date;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  @IsDate()
  public updated_at: Date;

  @DeleteDateColumn({ type: 'datetime', select: false, nullable: true })
  @IsDate()
  deleted_at?: Date;
}

function timestamp() {
  return configService.get('NODE_ENV') === 'development' ? 'bigint' : 'timestamp';
}


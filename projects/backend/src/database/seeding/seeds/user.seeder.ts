import { hash } from 'bcryptjs';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserEntity } from '../../../users/entity/user.entity';
import { Gender } from '../../../common/constants/gender.constant';
import { StatusUser } from '../../../common/constants/status-user.constant';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);

    const data = {
      name: 'Jose',
      lastname: 'Agraz',
      dni: 12345678,
      username: 'admin',
      gender: Gender.MAN,
      status: StatusUser.ACTIVE,
      phone: '4121234567',
      address: 'Medellin, Antioquia',
      email: 'admin@email.com',
      password: await hash('Passw*123', 10),
    };

    const user = await repository.findOneBy({ username: data.username });

    if (!user) {
      await repository.insert([data]);
    }

    const userFactory = await factoryManager.get(UserEntity);
    await userFactory.save();
    await userFactory.saveMany(9);
  }
}

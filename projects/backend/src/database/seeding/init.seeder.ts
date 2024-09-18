import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';
import UserSeeder from './seeds/user.seeder';
import TaskSeeder from './seeds/task.seeder';
import userFactory from './factories/user.factory';
import taskFactory from './factories/task.factory';

export default class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [UserSeeder, TaskSeeder],
      factories: [userFactory, taskFactory],
    });
  }
}

import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { TaskEntity } from '../../../tasks/entity/task.entity';

export default class TaskSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const factory = factoryManager.get(TaskEntity);
    await factory.save();
    await factory.saveMany(10);
  }
}

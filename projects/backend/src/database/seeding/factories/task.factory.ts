import { setSeederFactory } from 'typeorm-extension';
import { TaskEntity } from '../../../tasks/entity/task.entity';
import { StatusTasks } from '../../../common/constants/status-tasks.constant';

export default setSeederFactory(TaskEntity, async (faker) => {
  const task = new TaskEntity();

  task.title = faker.random.words({ min: 3, max: 8 });
  task.description = faker.random.words({ min: 10, max: 120 });
  task.status = StatusTasks.PENDING;
  return task;
});

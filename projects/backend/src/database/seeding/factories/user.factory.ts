import { hash } from 'bcryptjs';
import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from '../../../users/entity/user.entity';
import { Gender } from '../../../common/constants/gender.constant';
import { StatusUser } from '../../../common/constants/status-user.constant';

export default setSeederFactory(UserEntity, async (faker) => {
  const user = new UserEntity();

  user.name = faker.name.firstName();
  user.lastname = faker.name.lastName();
  user.dni = parseInt(faker.finance.account(8));
  user.username = faker.internet.userName(user.name, user.lastname);
  user.gender = Gender.MAN;
  user.status = StatusUser.ACTIVE;
  user.phone = faker.helpers.fromRegExp(/57318[0-9]{7}/);
  user.address = faker.location.streetAddress();
  user.email = faker.internet.email(user.name);
  user.password = await hash('Passw*123', 10);
  return user;
});

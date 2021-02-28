import { Repository, EntityRepository } from 'typeorm';
import { User } from '../models/user';

@EntityRepository(User)
class usersRepository extends Repository<User>{

}

export { usersRepository }
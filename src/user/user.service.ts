import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { get } from 'lodash';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async createOne(userDto): Promise<User> {
    const user: User = new User();
    user.name = get(userDto, 'name', null);
    user.email = get(userDto, 'email', null);
    user.role = get(userDto, 'role', null);
    user.password = await this.generateHash(get(userDto, 'password', null));
    return this.userRepository.save(user);
  }

  private async generateHash(password) {
    try {
      const saltOrRounds = 10;
      return await hash(password, saltOrRounds);
    } catch (error) {
      throw new InternalServerErrorException(
        'INVALID_REPOSITORY_GENERATE_HASH',
        {
          ...error,
          message: get(error, 'message', null),
        },
      );
    }
  }
}

import { Controller, InternalServerErrorException } from '@nestjs/common';
import { AppService } from './app.service';
import { get } from 'lodash';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { hash } from 'bcrypt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'users/findOne' })
  async findOne(@Payload() userDto: any): Promise<any> {
    console.log("userDto=",userDto)
    const email = get(userDto, 'email', null);
    try {
      return {
        id: '123456',
        name: 'BoRe',
        email,
        password: this.generateHash('123123'),
        role: 'ADMIN'
      }
    } catch (error) {
      throw new Error('INVALID_CONTROLLER_USERS_FIND_ONE');
    }
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

import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { get } from 'lodash';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'users/findOne' })
  async findOne(@Payload() userDto: any): Promise<any> {
    try {
      const email = get(userDto, 'email', null);
      const user = await this.userService.findOne(email);
      return user;
    } catch (error) {
      throw new Error('INVALID_CONTROLLER_USERS_FIND_ONE');
    }
  }

  @MessagePattern({ cmd: 'users/createOne' })
  async createOne(@Payload() userDto: any): Promise<any> {
    try {
      const params = get(userDto, 'params', {});
      const user = await this.userService.createOne(params);
      return user;
    } catch (error) {
      throw new Error('INVALID_CONTROLLER_USERS_CREATE_ONE');
    }
  }
}

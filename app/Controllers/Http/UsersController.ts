import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Util } from 'App/Helpers/Util';
import { IPagination } from 'App/Helpers/contracts/pagination';
import { UserRepository } from 'App/Repositories/user.repository';

import { UserService } from "App/Services/user/user.service";
import { UserProps } from 'App/Types/user.type';

export default class UsersController {
  private userService: UserService
  constructor() {
    this.userService = new UserService(new UserRepository())
  }
  public async index({ response, request }: HttpContextContract) {
    const body = request.all()
    const pagination: IPagination = Util.transformPagination(body)
    const users = await this.userService.query(pagination);
    return response.json(users)
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.all() as UserProps

    const userDto = {
      password: body.password,
      age: body.age,
      email: body.email,
      nome: body.nome
    };

    try {
      const result = await this.userService.execute(userDto);

      return response.json(result)
    } catch (error) {
      return response.json(error)
    }
  }

  public async show({ response, params }: HttpContextContract) {
    const { id } = params;
    const result = await this.userService.findOne(id)
    return response.json(result)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const { id } = params;
    const body = request.all() as UserProps;
    try {
     await this.userService.update(id, body);
      return response.json('User updated successfully')
    } catch (error) {
      return response.json(error)
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const { id } = params
    try {
      const user = await this.userService.delete(id);
      return user
    } catch (error) {
       return response.json(error);
    }
  }
}

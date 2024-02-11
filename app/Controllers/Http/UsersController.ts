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
    return response.status(200).json(users)
  }

  public async store({ request, response }: HttpContextContract) {
    const { password, age, email, name } = request.all() as UserProps

    try {
      const result = await this.userService.execute({
        password,
        age,
        email,
        name,
      });

      return response.status(201).json(result)
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
    const { age, email, name, password } = request.all() as UserProps;
    try {
     await this.userService.update(id, { age, email, name, password });
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

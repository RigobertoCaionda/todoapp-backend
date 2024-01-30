import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class AuthController {
  async login({ request, response, auth }: HttpContextContract ) {
    const { email, password } = request.all();

    if(!email) {
      return response.json('Email é obrigatório')
    }
    const user = await User.findBy('email', email)

    if(!user?.id) {
      return response.json('Usuário e/ou senha errados')
    }

    try {
      const token = await auth.attempt(email, password, {
        expiresIn: "2 days",
      });
      return response.json({
        token
      })
    } catch (error) {
      return response.json("Usuário e/ou senha errados");
    }

  }
}

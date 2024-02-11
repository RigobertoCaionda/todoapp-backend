import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class AuthController {
  async login({ request, response, auth }: HttpContextContract ) {
    const { email, password } = request.all();

    if(!email) {
      return response.json('Email is required')
    }
    const user = await User.findBy('email', email)

    if(!user?.id) {
      return response.json('User and/or password are incorrect')
    }

    try {
      const token = await auth.attempt(email, password, {
        expiresIn: "2 days",
      });
      return response.status(200).json({
        token
      })
    } catch (error) {
      return response.json("User and/or password are incorrect");
    }

  }
}

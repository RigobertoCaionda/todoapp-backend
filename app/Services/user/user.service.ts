import { IPagination } from "App/Helpers/contracts/pagination";
import { UserRepository } from "App/Repositories/user.repository";
import { UserProps } from "App/Types/user.type";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async query(pagination: IPagination) {
    const users = await this.userRepository.findAll(pagination);
    return users;
  }

  public async execute(userDto: UserProps) {
    if (!userDto.email) {
      return {
        error: "Email is required"
       };
    }

    if (!userDto.password) {
      return {
        error: "Password is required"
      }
    }

    if (!userDto.name) {
      return {
        error: "Name is required",
      };
    }
    const newUser = await this.userRepository.create(userDto);
    return newUser
  }

  public async findOne(id: number) {
    if(!id) {
      return {
        error: 'Id is required'
      }
    }
    const user = await this.userRepository.findById(id)

    if(!user) {
      return {
        error: 'User does not exists'
      }
    }
    return user;
  }

  public async update(id: number, userDto: UserProps) {
    if(!id) {
      return {
        error: 'Id is required'
      }
    }

    const updatedUser = await this.userRepository.update(id, userDto)
    return updatedUser;
  }

  public async delete(id: number) {
    if (!id) {
      return {
        error: "Id is required",
      };
    }

      const user = await this.userRepository.delete(id)
      return user;
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(username: string): Promise<User> {
    const exists = await this.userRepository.findOneBy({username: username});
    //console.log(exists)
    if (exists){
        return exists;
    }
    const newUser = this.userRepository.create({username: username});
    return await this.userRepository.save(newUser);
  }
}
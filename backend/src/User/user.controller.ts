import { Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import {User} from './user.entity';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get()
    findAll(): Promise<User[]>{
        return this.userService.findAll();
    }

    @Post()
    create(@Req() request: Request): Promise<User> {
        return this.userService.create(request.body.username);
    }
}

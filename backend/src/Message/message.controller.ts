import { Controller, Get, Post, Put, Req } from '@nestjs/common';
import {MessageService } from './message.service';
import { Message } from './message.entity';
import { Request } from 'express';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService){}

    @Get()
    findAll(): Promise<Message[]> {
        return this.messageService.findAll();
    }

    @Post()
    create(@Req() request: Request): Promise<Message> {
        return this.messageService.create(request.body);
    }

    @Put()
    update(@Req() request: Request) {
        return this.messageService.update(request.body);
    }

    @Put('delete')
    delete(@Req() request: Request) {
        return this.messageService.delete(request.body.messageId);
    }
}

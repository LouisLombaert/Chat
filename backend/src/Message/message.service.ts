import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private messageRepository: Repository<Message>,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async create(messageData: {message: string, sender: number}): Promise<Message> {
    const newMessage = this.messageRepository.create({ message: messageData.message, user: { id: messageData.sender } });
    return await this.messageRepository.save(newMessage);
  }
}
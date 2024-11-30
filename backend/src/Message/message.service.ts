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
    return this.messageRepository.find({where: {deleted: false}});
  }

  async create(messageData: {message: string, sender: number}): Promise<Message> {
    const newMessage = this.messageRepository.create({ message: messageData.message, user: { id: messageData.sender } });
    return await this.messageRepository.save(newMessage);
  }

  async update(messageData: {newMessage: string, messageId: number}){
    await this.messageRepository.update(messageData.messageId, {message: messageData.newMessage, modifiedAt: new Date()})
  }

  // delete message
  async delete(messageId: number){
    await this.messageRepository.update(messageId, {deleted: true});
  }
}
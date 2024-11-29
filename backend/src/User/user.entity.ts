import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Message } from '../Message/message.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 250}) // unique: true
    username: string;

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];
}

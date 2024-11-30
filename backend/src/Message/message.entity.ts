import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { User } from '../User/user.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @ManyToOne(() => User, (user) => user.messages)
    // @JoinColumn({name: 'sender'}) // rename the column
    user: User

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({type: 'datetime', default: null})
    modifiedAt: Date

    @Column({default: false})
    deleted: boolean
}
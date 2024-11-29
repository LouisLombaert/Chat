import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './User/user.module';
import { MessageModule } from './Message/message.module';

@Module({
  imports: [UserModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

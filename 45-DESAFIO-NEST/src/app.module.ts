import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { ProductsModule } from './products/products.module';
import { UsersService } from './users/users.service';
import { CartsService } from './carts/carts.service';
import { MessagesService } from './messages/messages.service';
import { UsersModule } from './users/users.module';
import { CartsModule } from './carts/carts.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [CatsModule, ProductsModule, UsersModule, CartsModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService, UsersService, CartsService, MessagesService],
})
export class AppModule {}

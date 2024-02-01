import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMidlleware } from './user/middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
configure (consumer:MiddlewareConsumer){
consumer.apply(AuthMidlleware).forRoutes({
path :'*',
method : RequestMethod.ALL
}
  )  }
}

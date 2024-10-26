import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VehiclesModule } from './vehicles/vehicles.module';
import * as Joi from 'joi';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    //Adds a limit of 10 requests per minute to the application
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    //Set up the ConfigModule with a validation schema
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        GM_API_URL: Joi.string().uri().required(),
      }),
    }),
    VehiclesModule,
  ],
})
export class AppModule {}

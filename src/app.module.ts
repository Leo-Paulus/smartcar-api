import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VehiclesModule } from './vehicles/vehicles.module';
import * as Joi from 'joi';

@Module({
  imports: [
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

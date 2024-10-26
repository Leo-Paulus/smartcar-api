import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [HttpModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
// src/vehicles/vehicles.controller.ts

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { BatteryRange, DoorStatus, EngineActionResult, FuelRange, Vehicle } from './models/vehicles.model';
import { VehicleIdDto  } from './dto/VehicleId.dto';
import { EngineActionDto } from './dto/EngineAction.dto';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle information' })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle ID' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle information retrieved',
    type: Vehicle,
  })
  async getVehicleInfo(@Param('id') id: string): Promise<Vehicle> {
    const vehicleIdDto = new VehicleIdDto();
    vehicleIdDto.id = id;
    return this.vehiclesService.getVehicleInfo(vehicleIdDto);
  }

  @Get(':id/doors')
  @ApiOperation({ summary: 'Get vehicle door status' })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle ID' })
  @ApiResponse({
    status: 200,
    description: 'Door status retrieved',
    type: DoorStatus,  
    isArray: true,       
  })
  async getDoorStatus(@Param() params: VehicleIdDto): Promise<DoorStatus[]> {
    const vehicleIdDto = new VehicleIdDto();
    vehicleIdDto.id = params.id;
    return this.vehiclesService.getDoorStatus(vehicleIdDto);
  }

  @Get(':id/fuel')
  @ApiOperation({ summary: 'Get vehicle fuel level' })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle ID' })
  @ApiResponse({
    status: 200,
    description: 'Fuel level retrieved',
    type: FuelRange,
  })
  async getFuelLevel(@Param() params: VehicleIdDto): Promise<FuelRange> {
    const vehicleIdDto = new VehicleIdDto();
    vehicleIdDto.id = params.id;
    return this.vehiclesService.getFuelLevel(vehicleIdDto);
  }

  @Get(':id/battery')
  @ApiOperation({ summary: 'Get vehicle battery level' })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle ID' })
  @ApiResponse({
    status: 200,
    description: 'Battery level retrieved',
    type: BatteryRange,
  })
  async getBatteryLevel(@Param() params: VehicleIdDto): Promise<BatteryRange> {
    const vehicleIdDto = new VehicleIdDto();
    vehicleIdDto.id = params.id;
    return this.vehiclesService.getBatteryLevel(vehicleIdDto);
  }

  @Post(':id/engine')
  @ApiOperation({ summary: 'Start or stop the vehicle engine' })
  @ApiParam({ name: 'id', type: String, description: 'Vehicle ID' })
  @ApiBody({ description: 'Engine action', type: EngineActionDto })
  @ApiResponse({
    status: 200,
    description: 'Engine action executed',
    type: EngineActionResult,
  })
  async engineAction(
    @Param() params: VehicleIdDto,
    @Body() actionDto: EngineActionDto,
  ): Promise<EngineActionResult> {
    console.log(actionDto);
    return this.vehiclesService.engineAction(params, actionDto);
  }
}

// src/vehicles/vehicles.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { DoorStatus, EngineActionResult, FuelRange, BatteryRange, Vehicle } from './models/vehicles.model';
import { ConfigService } from '@nestjs/config';
import { VehicleIdDto } from './dto/VehicleId.dto';
import { EngineActionDto } from './dto/EngineAction.dto';

@Injectable()
export class VehiclesService {
  private readonly gmApiUrl: string;
  
  constructor(private configService: ConfigService) {
    this.gmApiUrl = this.configService.get<string>('GM_API_URL');
  }

  private async postToGmApi(endpoint: string, data: object): Promise<any> {
    try {
      const response = await axios.post(`${this.gmApiUrl}/${endpoint}`, {
        ...data,
        responseType: 'JSON',
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to communicate with the GM API',
        HttpStatus.INTERNAL_SERVER_ERROR, error
      );
    }
  }

  async getVehicleInfo(vehicleIdDto: VehicleIdDto): Promise<Vehicle> {  // Use DTO
    const { id } = vehicleIdDto;  
    const gmResponse = await this.postToGmApi('getVehicleInfoService', { id });

    if (gmResponse.status !== '200') {
      throw new HttpException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    const data = gmResponse.data;
    const doorCount = data.fourDoorSedan.value === 'True' ? 4 : 2;

    return new Vehicle({
      vin: data.vin.value,
      color: data.color.value,
      doorCount,
      driveTrain: data.driveTrain.value,
    });
  }

  async getDoorStatus(vehicleIdDto: VehicleIdDto): Promise<DoorStatus[]> {  
    const { id } = vehicleIdDto;  
    const gmResponse = await this.postToGmApi('getSecurityStatusService', { id });

    if (gmResponse.status !== '200') {
      throw new HttpException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    return gmResponse.data.doors.values.map(
      (door) =>
        new DoorStatus({
          location: door.location.value,
          locked: door.locked.value === 'True',
        }),
    );
  }

  async getFuelLevel(vehicleIdDto: VehicleIdDto): Promise<FuelRange> {  
    const { id } = vehicleIdDto;  
    const gmResponse = await this.postToGmApi('getEnergyService', { id });

    if (gmResponse.status !== '200') {
      throw new HttpException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    const level = gmResponse.data.tankLevel.value;
    if (level === 'null') {
      throw new HttpException(
        'Fuel information not available',
        HttpStatus.NOT_FOUND,
      );
    }

    return new FuelRange(parseFloat(level));
  }

  async getBatteryLevel(vehicleIdDto: VehicleIdDto): Promise<BatteryRange> {  
    const { id } = vehicleIdDto;  
    const gmResponse = await this.postToGmApi('getEnergyService', { id });

    if (gmResponse.status !== '200') {
      throw new HttpException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    const level = gmResponse.data.batteryLevel.value;
    if (level === 'null') {
      throw new HttpException(
        'Battery information not available',
        HttpStatus.NOT_FOUND,
      );
    }

    return new BatteryRange(parseFloat(level));
  }

  async engineAction(
    vehicleIdDto: VehicleIdDto,  
    engineActionDto: EngineActionDto, 
  ): Promise<EngineActionResult> {
    const { id } = vehicleIdDto;
    const { action } = engineActionDto;

    const command = action === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE';

    const gmResponse = await this.postToGmApi('actionEngineService', {
      id,
      command,
    });

    if (gmResponse.status !== '200') {
      return new EngineActionResult('error');
    }

    const resultStatus = gmResponse.actionResult.status;
    return new EngineActionResult(
      resultStatus === 'EXECUTED' ? 'success' : 'error',
    );
  }
}

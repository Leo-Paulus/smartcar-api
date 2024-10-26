import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { ConfigModule } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { VehiclesService } from '../vehicles.service';
import { DoorStatus, EngineActionResult, FuelRange, BatteryRange, Vehicle } from '../models/vehicles.model';
import { VehicleIdDto } from '../dto/VehicleId.dto';
import { EngineActionDto } from '../dto/EngineAction.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [VehiclesService],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getVehicleInfo', () => {
    it('should return vehicle info on success', async () => {
      const gmResponse = {
        status: '200',
        data: {
          vin: { value: '123123412412' },
          color: { value: 'Metallic Silver' },
          fourDoorSedan: { value: 'True' },
          twoDoorCoupe: { value: 'False' },
          driveTrain: { value: 'v8' },
        },
      };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      const result = await service.getVehicleInfo(vehicleIdDto);

      expect(result).toEqual(
        new Vehicle({
          vin: '123123412412',
          color: 'Metallic Silver',
          doorCount: 4,
          driveTrain: 'v8',
        }),
      );
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://gmapi.azurewebsites.net/getVehicleInfoService',
        { id: '1234', responseType: 'JSON' },
      );
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      const gmResponse = { status: '404' };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      await expect(service.getVehicleInfo(vehicleIdDto)).rejects.toThrow(
        new HttpException('Vehicle not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an internal error if axios request fails', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network Error'));

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      await expect(service.getVehicleInfo(vehicleIdDto)).rejects.toThrow(
        new HttpException('Failed to communicate with the GM API', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('getDoorStatus', () => {
    it('should return door status on success', async () => {
      const gmResponse = {
        status: '200',
        data: {
          doors: {
            values: [
              { location: { value: 'frontLeft' }, locked: { value: 'True' } },
              { location: { value: 'frontRight' }, locked: { value: 'False' } },
            ],
          },
        },
      };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      const result = await service.getDoorStatus(vehicleIdDto);

      expect(result).toEqual([
        new DoorStatus({ location: 'frontLeft', locked: true }),
        new DoorStatus({ location: 'frontRight', locked: false }),
      ]);
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      const gmResponse = { status: '404' };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      await expect(service.getDoorStatus(vehicleIdDto)).rejects.toThrow(
        new HttpException('Vehicle not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an internal error if axios request fails', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network Error'));

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      await expect(service.getDoorStatus(vehicleIdDto)).rejects.toThrow(
        new HttpException('Failed to communicate with the GM API', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('getFuelLevel', () => {
    it('should return fuel level on success', async () => {
      const gmResponse = {
        status: '200',
        data: {
          tankLevel: { value: '45.5' },
        },
      };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      const result = await service.getFuelLevel(vehicleIdDto);

      expect(result).toEqual(new FuelRange(45.5));
    });

    it('should throw NotFoundException if fuel info is not available', async () => {
      const gmResponse = {
        status: '200',
        data: {
          tankLevel: { value: 'null' },
        },
      };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      await expect(service.getFuelLevel(vehicleIdDto)).rejects.toThrow(
        new HttpException('Fuel information not available', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      const gmResponse = { status: '404' };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      await expect(service.getFuelLevel(vehicleIdDto)).rejects.toThrow(
        new HttpException('Vehicle not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getBatteryLevel', () => {
    it('should return battery level on success', async () => {
      const gmResponse = {
        status: '200',
        data: {
          batteryLevel: { value: '85.3' },
        },
      };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234';

      const result = await service.getBatteryLevel(vehicleIdDto);

      expect(result).toEqual(new BatteryRange(85.3));
    });

    it('should throw NotFoundException if battery info is not available', async () => {
      const gmResponse = {
        status: '200',
        data: {
          batteryLevel: { value: 'null' },
        },
      };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      await expect(service.getBatteryLevel(vehicleIdDto)).rejects.toThrow(
        new HttpException('Battery information not available', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      const gmResponse = { status: '404' };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      await expect(service.getBatteryLevel(vehicleIdDto)).rejects.toThrow(
        new HttpException('Vehicle not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('engineAction', () => {
    it('should return success when engine is started', async () => {
      const gmResponse = {
        status: '200',
        actionResult: { status: 'EXECUTED' },
      };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      const actionDto = new EngineActionDto();
      actionDto.action = 'START'; // Set the action in the DTO

      const result = await service.engineAction(vehicleIdDto, actionDto);

      expect(result).toEqual(new EngineActionResult('success'));
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://gmapi.azurewebsites.net/actionEngineService',
        { id: '1234', command: 'START_VEHICLE', responseType: 'JSON' },
      );
    });

    it('should return error when engine action fails', async () => {
      const gmResponse = {
        status: '200',
        actionResult: { status: 'FAILED' },
      };
      mockedAxios.post.mockResolvedValue({ data: gmResponse });

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      const actionDto = new EngineActionDto();
      actionDto.action = 'STOP'; // Set the action in the DTO

      const result = await service.engineAction(vehicleIdDto, actionDto);

      expect(result).toEqual(new EngineActionResult('error'));
    });

    it('should throw an internal error if axios request fails', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network Error'));

      const vehicleIdDto = new VehicleIdDto();
      vehicleIdDto.id = '1234'; // Set the id in the DTO

      const actionDto = new EngineActionDto();
      actionDto.action = 'START'; // Set the action in the DTO

      await expect(service.engineAction(vehicleIdDto, actionDto)).rejects.toThrow(
        new HttpException('Failed to communicate with the GM API', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});

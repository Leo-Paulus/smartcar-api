import { ApiProperty } from "@nestjs/swagger";

export class Vehicle {
    @ApiProperty({ example: '123ABC456DEF7890', description: 'The VIN of the vehicle' })
    vin: string;
    @ApiProperty({ example: 'Metallic Silver', description: 'The color of the vehicle' })
    color: string;
    @ApiProperty({ example: 4, description: 'The number of doors' })
    doorCount: number;
    @ApiProperty({ example: 'v8', description: 'The drive train of the vehicle' })
    driveTrain: string;
  
    constructor(partial: Partial<Vehicle>) {
      Object.assign(this, partial);
    }
  }
  
  export class DoorStatus {
    @ApiProperty({ example: 'frontLeft', description: 'Location of the door' })
    location: string;
  
    @ApiProperty({ example: true, description: 'Lock status of the door' })
    locked: boolean;
  
    constructor(partial: Partial<DoorStatus>) {
      Object.assign(this, partial);
    }
  }
  
  export class FuelRange {
    @ApiProperty({ example: 30.2, description: 'Fuel percentage level' })
    percent: number;
  
    constructor(percent: number) {
      this.percent = percent;
    }
  }
  
  export class BatteryRange {
    @ApiProperty({ example: 85.3, description: 'Battery percentage level' })
    percent: number;
  
    constructor(percent: number) {
      this.percent = percent;
    }
  }
  
  export class EngineActionResult {
    @ApiProperty({ example: 'success', enum: ['success', 'error'], description: 'Result of the engine action' })
    status: 'success' | 'error';
  
    constructor(status: 'success' | 'error') {
      this.status = status;
    }
  }
  
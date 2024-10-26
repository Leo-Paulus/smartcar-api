import { IsString, Matches } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleIdDto {
@ApiProperty({ example: '5213', description: 'Vehicle ID' })
  @Trim()
  @IsString()
  @Matches(/^\d+$/, { message: 'ID must be a numeric string' })
  id: string;
}
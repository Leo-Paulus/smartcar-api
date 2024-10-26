import { IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EngineActionDto {
  @ApiProperty({ example: 'START', enum: ['START', 'STOP'], description: 'Action to perform on the engine' })
  @IsString()
  @IsIn(['START', 'STOP'])
  action: 'START' | 'STOP';
}
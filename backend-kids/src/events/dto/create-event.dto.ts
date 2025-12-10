import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
    @ApiProperty({ example: 'Breakfast', description: 'Name of the event' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Morning breakfast for kids', description: 'Description of the event' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'https://example.com/event.jpg', required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}

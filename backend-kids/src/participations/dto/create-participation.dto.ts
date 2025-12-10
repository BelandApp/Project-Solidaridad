import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipationDto {
    @ApiProperty({ example: 'uuid-child', description: 'ID of the child' })
    @IsUUID()
    @IsNotEmpty()
    childId: string;

    @ApiProperty({ example: 'uuid-event', description: 'ID of the event' })
    @IsUUID()
    @IsNotEmpty()
    eventId: string;
}

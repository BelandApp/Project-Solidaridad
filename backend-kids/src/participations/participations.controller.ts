import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { RegisterByQrDto } from './dto/register-by-qr.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('participations')
@Controller('participations')
export class ParticipationsController {
    constructor(private readonly participationsService: ParticipationsService) { }

    @Post()
    @ApiOperation({ summary: 'Register a participation manually' })
    @ApiResponse({ status: 201, description: 'Participation registered.' })
    @ApiResponse({ status: 409, description: 'Child already participated in this event.' })
    @ApiResponse({ status: 404, description: 'Child or Event not found.' })
    create(@Body() createDto: CreateParticipationDto) {
        return this.participationsService.create(createDto);
    }

    @Post('register-by-qr')
    @ApiOperation({ summary: 'Register a participation by scanning QR' })
    @ApiResponse({ status: 201, description: 'Participation registered.' })
    @ApiResponse({ status: 409, description: 'Child already participated in this event.' })
    registerByQr(@Body() dto: RegisterByQrDto) {
        return this.participationsService.registerByQr(dto);
    }

    @Get('by-child/:childId')
    @ApiOperation({ summary: 'Get participations by child with pagination' })
    @ApiParam({ name: 'childId', format: 'uuid' })
    findAllByChild(@Param('childId', ParseUUIDPipe) childId: string, @Query() paginationDto: PaginationDto) {
        return this.participationsService.findByChild(childId, paginationDto.page, paginationDto.limit);
    }

    @Get('by-event/:eventId')
    @ApiOperation({ summary: 'Get participations by event with pagination' })
    @ApiParam({ name: 'eventId', format: 'uuid' })
    findAllByEvent(@Param('eventId', ParseUUIDPipe) eventId: string, @Query() paginationDto: PaginationDto) {
        return this.participationsService.findByEvent(eventId, paginationDto.page, paginationDto.limit);
    }
}

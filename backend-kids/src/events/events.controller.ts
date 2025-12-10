import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new event' })
    @ApiResponse({ status: 201, description: 'Event created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    create(@Body() createEventDto: CreateEventDto) {
        return this.eventsService.create(createEventDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all events' })
    @ApiResponse({ status: 200, description: 'List of events.' })
    findAll() {
        return this.eventsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an event by ID' })
    @ApiParam({ name: 'id', format: 'uuid' })
    @ApiResponse({ status: 200, description: 'Event found.' })
    @ApiResponse({ status: 404, description: 'Event not found.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.eventsService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an event' })
    @ApiParam({ name: 'id', format: 'uuid' })
    @ApiResponse({ status: 200, description: 'Event updated.' })
    @ApiResponse({ status: 404, description: 'Event not found.' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEventDto: UpdateEventDto) {
        return this.eventsService.update(id, updateEventDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an event' })
    @ApiParam({ name: 'id', format: 'uuid' })
    @ApiResponse({ status: 200, description: 'Event deleted.' })
    @ApiResponse({ status: 404, description: 'Event not found.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.eventsService.remove(id);
    }
}

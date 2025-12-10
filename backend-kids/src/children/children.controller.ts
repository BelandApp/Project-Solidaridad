import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('children')
@Controller('children')
export class ChildrenController {
    constructor(private readonly childrenService: ChildrenService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new child', description: 'Creates a child and generates a QR code automatically.' })
    @ApiResponse({ status: 201, description: 'Child created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    create(@Body() createChildDto: CreateChildDto) {
        return this.childrenService.create(createChildDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all children' })
    @ApiResponse({ status: 200, description: 'List of children.' })
    findAll() {
        return this.childrenService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a child by ID' })
    @ApiParam({ name: 'id', format: 'uuid' })
    @ApiResponse({ status: 200, description: 'Child found.' })
    @ApiResponse({ status: 404, description: 'Child not found.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.childrenService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a child' })
    @ApiParam({ name: 'id', format: 'uuid' })
    @ApiResponse({ status: 200, description: 'Child updated.' })
    @ApiResponse({ status: 404, description: 'Child not found.' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateChildDto: UpdateChildDto) {
        return this.childrenService.update(id, updateChildDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a child' })
    @ApiParam({ name: 'id', format: 'uuid' })
    @ApiResponse({ status: 200, description: 'Child deleted.' })
    @ApiResponse({ status: 404, description: 'Child not found.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.childrenService.remove(id);
    }
}

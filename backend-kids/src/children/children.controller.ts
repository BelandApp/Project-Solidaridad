import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe, UseInterceptors, UploadedFile, BadRequestException, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SearchChildrenDto } from './dto/search-child.dto';

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

    @Post('upload-csv')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload CSV file to bulk create children', description: 'Headers: fullName, age, sex' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Children created successfully.' })
    async uploadCsv(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.childrenService.uploadCsv(file.buffer);
    }

    @Get('export-qrs')
    @ApiOperation({ summary: 'Download all QR codes as ZIP' })
    @ApiResponse({ status: 200, description: 'ZIP file downloaded.' })
    async downloadQrs(@Res() res: Response) {
        const archive = await this.childrenService.downloadAllQrs();
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="qr-codes.zip"');
        archive.pipe(res);
    }


    @Get()
    @ApiOperation({ summary: 'List all children with pagination' })
    @ApiResponse({ status: 200, description: 'Paginated list of children.' })
    findAll(@Query() searchDto: SearchChildrenDto) {
        return this.childrenService.findAll(searchDto);
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

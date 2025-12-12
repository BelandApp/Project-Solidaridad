import { IsOptional, IsString, IsNumber, IsIn, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchChildrenDto extends PaginationDto {
    @ApiPropertyOptional({ description: 'Filter by child name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Filter by sex', enum: ['Niño', 'Niña'] })
    @IsOptional()
    @IsIn(['Niño', 'Niña'])
    sex?: 'Niño' | 'Niña';

    @ApiPropertyOptional({ description: 'Minimum age filter' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minAge?: number;

    @ApiPropertyOptional({ description: 'Maximum age filter' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxAge?: number;
}

import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChildDto {
    @ApiProperty({ example: 'Juan Perez', description: 'Full name of the child' })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: '12345678', description: 'DNI or Passport' })
    @IsString()
    @IsNotEmpty()
    document: string;

    @ApiProperty({ example: 8, description: 'Age of the child' })
    @IsNumber()
    age: number;

    @ApiProperty({ example: '2015-05-15', description: 'Birth date in ISO8601' })
    @IsDateString()
    birthDate: string; // Receives string, service might convert or save as date

    @ApiProperty({ example: 'Maria Perez', description: 'Name of the tutor' })
    @IsString()
    @IsNotEmpty()
    tutorName: string;

    @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}

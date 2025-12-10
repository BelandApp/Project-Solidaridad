import { IsString, IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChildDto {
    @ApiProperty({ example: 'Juan Perez', description: 'Full name of the child' })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: 8, description: 'Age of the child' })
    @IsNumber()
    age: number;

    @ApiProperty({ example: 'Niño', description: 'Sex of the child' })
    @IsString()
    @IsNotEmpty()
    sex: 'Niño' | 'Niña';

}

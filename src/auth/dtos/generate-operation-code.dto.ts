import { ApiProperty } from '@nestjs/swagger';

export class GenerateOperationCodeDto {
    @ApiProperty({ description: 'Username of the user', example: 'prisonb91@gmail.com' })
    username!: string;

    @ApiProperty({ description: 'Type of the operation', example: 'transfer' })
    type!: string;
}

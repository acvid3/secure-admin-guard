import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'Username of the user', example: 'prisonb91@gmail.com' })
    username!: string;

    @ApiProperty({ description: 'Password of the user', example: 'password123' })
    password!: string;
}

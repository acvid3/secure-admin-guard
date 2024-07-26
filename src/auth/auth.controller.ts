import { Controller, Post, Body, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { GenerateOperationCodeDto } from './dtos/generate-operation-code.dto';

@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully. A confirmation email has been sent.' })
    @ApiResponse({ status: 400, description: 'User already exists.' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Get('confirm')
    @ApiOperation({ summary: 'Confirm user operation' })
    @ApiResponse({ status: 200, description: 'Operation confirmed successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid confirmation code.' })
    async confirm(@Query('code') code: string, @Query('type') type: string) {
        this.logger.debug(`Received confirm request with code: ${code} and type: ${type}`);
        return this.authService.confirmOperation(code, type);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login an existing user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully. A confirmation code has been sent to the email.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials or email not confirmed.' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('generate-operation-code')
    @ApiOperation({ summary: 'Generate operation code for user' })
    @ApiResponse({ status: 200, description: 'Operation code generated and sent to email.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async generateOperationCode(@Body() generateOperationCodeDto: GenerateOperationCodeDto) {
        const { username, type } = generateOperationCodeDto;
        return this.authService.generateOperationCode(username, type);
    }
}

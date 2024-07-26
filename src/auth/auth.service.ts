// src/auth/auth.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private emailService: EmailService, private jwtService: JwtService) {}

    async register(registerDto: RegisterDto): Promise<User> {
        const { username, password } = registerDto;
        const existingUser = await this.userModel.findOne({ username });

        if (existingUser) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const confirmationCode = uuidv4();
        const user = new this.userModel({ username, password: hashedPassword, confirmationCode });
        await user.save();

        const confirmationUrl = `http://${process.env.BASE_URL}/v1/auth/confirm?code=${confirmationCode}&type=register`;
        await this.emailService.sendMail(username, 'Confirm your registration', `Please confirm your registration by clicking on the following link: ${confirmationUrl}`);

        return user;
    }

    async confirmRegistration(code: string): Promise<void> {
        this.logger.debug(`Confirming registration with code: ${code}`);

        const user = await this.userModel.findOne({ confirmationCode: code });

        if (!user) {
            this.logger.error(`Invalid confirmation code: ${code}`);
            throw new HttpException('Invalid confirmation code', HttpStatus.BAD_REQUEST);
        }

        user.isConfirmed = true;
        user.confirmationCode = undefined;
        await user.save();
    }

    async login(loginDto: LoginDto): Promise<{ confirmUrl: string }> {
        const { username, password } = loginDto;
        const user = await this.userModel.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        if (!user.isConfirmed) {
            throw new HttpException('Email not confirmed', HttpStatus.UNAUTHORIZED);
        }

        const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
        await this.emailService.sendMail(username, 'Your login confirmation code', `Your confirmation code is: ${loginCode}`);
        user.loginCode = loginCode;
        await user.save();

        const confirmUrl = `${process.env.BASE_URL}/v1/auth/confirm`;
        return { confirmUrl };
    }

    async confirmOperation(code: string, type: string): Promise<{ accessToken?: string } | { status: boolean }> {
        this.logger.debug(`Confirming operation with code: ${code} and type: ${type}`);

        let user: UserDocument | null = null;

        if (type === 'register') {
            user = await this.userModel.findOne({ confirmationCode: code });

            if (!user) {
                this.logger.error(`Invalid confirmation code: ${code}`);
                throw new HttpException('Invalid confirmation code', HttpStatus.BAD_REQUEST);
            }

            user.isConfirmed = true;
            user.confirmationCode = undefined;
            await user.save();
            return { status: true };
        } else if (type === 'auth' || type === 'transfer') {
            user = await this.userModel.findOne({ loginCode: code });

            if (!user) {
                this.logger.error(`Invalid ${type} code: ${code}`);
                throw new HttpException('Invalid confirmation code', HttpStatus.BAD_REQUEST);
            }

            user.loginCode = undefined;
            await user.save();

            if (type === 'auth') {
                const accessToken = await this.generateAccessToken(user);
                this.logger.debug(`Generated access token for user: ${user.username}`);
                return { accessToken };
            } else if (type === 'transfer') {
                return { status: true };
            }
        } else {
            this.logger.error(`Invalid confirmation type: ${type}`);
            throw new HttpException('Invalid confirmation type', HttpStatus.BAD_REQUEST);
        }

        return { status: true };
    }

    async generateAccessToken(user: UserDocument): Promise<string> {
        const payload = { username: user.username, sub: user._id };
        this.logger.debug(`JWT_SECRET: ${process.env.JWT_SECRET}`);
        const token = this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT token for user: ${user.username}`);
        return token;
    }

    async generateOperationCode(username: string, type: string): Promise<void> {
        const user = await this.userModel.findOne({ username });

        if (!user) {
            this.logger.error(`User not found: ${username}`);
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const operationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const emailSubject = 'Your confirmation code';
        const emailText = `Your confirmation code is: ${operationCode}`;

        user.loginCode = operationCode;

        await this.emailService.sendMail(username, emailSubject, emailText);
        await user.save();
    }
}

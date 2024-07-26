import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET!,
            signOptions: { expiresIn: '5d' },
        }),
        EmailModule,
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}

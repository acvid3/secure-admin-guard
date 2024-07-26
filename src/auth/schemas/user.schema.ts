import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false, default: null })
    confirmationCode?: string;

    @Prop({ default: false })
    isConfirmed?: boolean;

    @Prop({ required: false, default: null })
    loginCode?: string;

    @Prop({ required: false, default: null })
    operationCode?: string;

    @Prop({ required: false, default: null })
    transferCode?: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

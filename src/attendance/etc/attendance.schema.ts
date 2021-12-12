import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  versionKey: false,
})
export class Attendance extends Document {
  @Prop({
    required: true,
  })
  lesson: string;

  @Prop({
    required: true,
  })
  topic: string;

  @Prop({
    required: true,
  })
  students: string[];

  @Prop()
  date: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

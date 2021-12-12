import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Student extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Number })
  number: number;

  @Prop({ required: true, type: String })
  class: string;
}
export const StudentSchema = SchemaFactory.createForClass(Student);

import { Module } from '@nestjs/common';
import { AttendanceModule } from './attendance/attendance.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    AttendanceModule,
    MongooseModule.forRoot('mongodb://localhost/yoklama'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

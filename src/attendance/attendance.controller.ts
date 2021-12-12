import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { StudentDto } from './dto/student.dto';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('add-student')
  @UseGuards(AuthGuard)
  addStudent(@Body() studentDto: StudentDto) {
    this.attendanceService.addStudent(studentDto);
  }

  @Post('get-class')
  @UseGuards(AuthGuard)
  getClass(@Body() body) {
    const { classroom } = body;
    return this.attendanceService.getClass(classroom);
  }

  @Post('create-attendance')
  @UseGuards(AuthGuard)
  createAttendance(@Body() body, @Res() res) {
    this.attendanceService.createAttendance(body);
    return res.status(200).send({ message: 'Attendance created' });
  }

  @Post('get-attendance')
  @UseGuards(AuthGuard)
  getAttendance(@Body() body) {
    let { date } = body;
    date = date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1');
    return this.attendanceService.getAttendance(date);
  }

  @Post('register')
  register(@Body() userDto: UserDto, @Res() res) {
    this.attendanceService.register(userDto).then((message) => {
      if (message == undefined || message == true) {
        return res.status(200).send({ message: true });
      } else if (message == false) {
        return res.status(202).send({ message: false });
      }
    });
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.attendanceService.login(loginDto, res);
    if (user) {
      return {
        message: true,
        token: user,
      };
    } else {
      return {
        message: false,
      };
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    const logout = this.attendanceService.logout(response);
    if (logout) {
      return {
        message: true,
      };
    } else {
      return {
        message: false,
      };
    }
  }
}

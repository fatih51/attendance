import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance } from './etc/attendance.schema';
import { Student } from './etc/student.schema';
import { User } from './etc/user.schema';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<Attendance>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  addStudent(studentDto: any) {
    const newStudent = {
      name: studentDto.name,
      number: studentDto.number,
      class: studentDto.classroom,
    };
    const student = new this.studentModel(newStudent);
    student.save();
  }

  getClass(classroom) {
    return this.studentModel.find({ class: classroom });
  }

  createAttendance(absent) {
    const date = new Date();
    const tarih = date.toLocaleDateString();
    const attendance = new this.attendanceModel({
      lesson: absent.lesson,
      topic: absent.topic,
      students: absent.students,
      date: tarih,
    });
    attendance.save();
  }

  getAttendance(date) {
    return this.attendanceModel.find({ date: date });
  }

  register(userDto: any) {
    const isExist = this.userModel
      .exists({ email: userDto.email })
      .then((result) => {
        if (result) {
          return false;
        } else {
          const saltRounds = 10;
          bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(userDto.password, salt, (err, hash) => {
              const newUser = {
                name: userDto.name,
                email: userDto.email,
                password: hash,
              };
              const user = new this.userModel(newUser);
              user.save();
              return true;
            });
          });
        }
      });
    return isExist;
  }

  async login(body, res) {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({
      id: user._id,
    });
    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: true,
    });
    return jwt;
  }

  logout(res) {
    try {
      res.clearCookie('jwt');
      return true;
    } catch (error) {
      return false;
    }
  }
}

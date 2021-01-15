import {UserSignupI, UserI, UserLoginI} from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import {genAuthToken, genRandomCode, genResetPasswordToken, sendMail, throwError} from '../utils';
import UserService from './user.service';

export interface CheckResetCodeI {
  email: string;
  code: string
}

export interface ResetPasswordCodeI {
  userId: string;
  password: string
}

class AuthService {
  constructor(private userService: typeof UserService) {
  }

  async signup(data: UserSignupI) {
    // Хешируем пароль
    data.password = await bcrypt.hash(data.password, 10);

    // Создаем пользователя
    const result: UserI = await this.userService.create(data);

    // Генерируем токен
    const userId = result.id.toString();
    const token = genAuthToken(userId);

    return {token, userId}
  }

  async login(data: UserLoginI) {
    // Проверить пароль и отправить токен

    // Найти пользователя
    const user = await this.userService.getOne({where: {email: data.email}, attributes: ['password', 'id']});

    // Проверить пароль
    const isEqual = await bcrypt.compare(data.password, user.password.trim());

    if (!isEqual) {
      throwError({
        code: 404,
        message: 'Invalid password'
      });
    }

    // Генерируем токен
    const userId = user.id;
    const token = genAuthToken(userId);

    return {token, userId}
  }

  async generateResetCode(email: string) {
    const passwordResetCode = genRandomCode(4);

    await this.userService.update(
      {passwordResetCode},
      {where: {email}}
      );

    await sendMail({
      to: email,
      subject: 'Reset Code',
      text: `Your reset code is ${passwordResetCode}`
    });

    return {message: 'Reset code successfully generated'}
  }

  async checkResetCode({email, code}: CheckResetCodeI) {
    const user = await this.userService.getOne({where: {email}, attributes: ['passwordResetCode', 'id']});

    if (user.passwordResetCode !== code) {
      throwError({
        code: 403,
        message: 'Wrong code'
      })
    }

    await this.userService.update({passwordResetCode: null}, {where: {id: user.id}});

    const token = genResetPasswordToken(user.id);

    return {
      message: "Code valid",
      token
    }
  }

  async resetPassword({password, userId}: ResetPasswordCodeI) {
    const hashedPw = await bcrypt.hash(password, 10);

    await this.userService.update({password: hashedPw}, {where: {id: userId}});

    return {message: 'Password successfully changed!'}
  }
}

const authService = new AuthService(UserService);

export default authService;

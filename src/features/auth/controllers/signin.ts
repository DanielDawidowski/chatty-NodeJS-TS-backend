import { IResetPasswordParams } from '@user/interfaces/user.interface';
import { emailQueue } from '@service/queues/email.queue';
// import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template';
import { userService } from '@service/db/user.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
// import Logger from 'bunyan';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';
import { config } from '@root/config';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { BadRequestError } from '@global/helpers/error-handler';
import { authService } from '@service/db/auth.service';
import { loginSchema } from '@auth/schemes/signin';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import moment from 'moment';
import publicIp from 'ip';
import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password-template';
// const log: Logger = config.createLogger('userCache');

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);
    // log.info(existingUser);
    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt: userJwt };
    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id,
      username: existingUser!.username,
      email: existingUser!.email,
      avatarColor: existingUser!.avatarColor,
      uId: existingUser!.uId,
      createdAt: existingUser!.createdAt
    } as IUserDocument;
    const templateParams: IResetPasswordParams = {
      username: existingUser.username!,
      email: existingUser.email!,
      ipaddress: publicIp.address(),
      date: moment().format('DD/MM/YYYY HH:mm')
    };
    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPassword', {
      template,
      receiverEmail: 'lyric.rowe@ethereal.email',
      subject: 'Password reset confirmation'
    });
    res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', user: userDocument, token: userJwt });
  }
}

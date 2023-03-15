import { Injectable } from '@nestjs/common';
import { MailService as BaseMailService } from '@sendgrid/mail';
import { IMessage, IMailService } from '../../types';

@Injectable()
export class MailService implements IMailService {
  private transporter: BaseMailService;

  constructor() {
    this.transporter = new BaseMailService();
    this.transporter.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendMail(message: IMessage): Promise<void> {
    await this.transporter.send({
      from: {
        name: process.env.SENDGRID_FROM_NAME,
        email: process.env.SENDGRID_FROM_EMAIL,
      },
      ...message,
    });
  }
}

import { RequireOnlyOne } from '../utils';

/* eslint-disable prettier/prettier */
export interface IAddress {
  email: string;
  name?: string;
}

export type IMessage =
  | {
      /**
       * Defaults are:
       *
       * `from.name = "mentor cycle"`
       *
       * `from.email = "hello.mentor.cycle"`
       */
      from?: IAddress;
      to: IAddress | IAddress[];
      subject?: string;
      templateId: string;
      dynamicTemplateData?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      };
    }
  | {
      /**
       * Defaults are:
       *
       * `from.name = "mentor cycle"`
       *
       * `from.email = "hello.mentor.cycle"`
       */
      from?: IAddress;
      to: IAddress | IAddress[];
      subject?: string;
      html: string;
    };

export type IReturnMail = RequireOnlyOne<
  {
    subject?: string;
    templateId?: string;
    html?: string;
  },
  'html' | 'templateId'
>;

export interface IMailService {
  sendMail(message: IMessage): Promise<void>;
}

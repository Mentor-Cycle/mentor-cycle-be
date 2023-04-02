import { IReturnMail } from '@common/types';

export const passwordResetEmailProps = (html: string): IReturnMail => ({
  subject: 'Reset your password',
  html,
});

export const updatePasswordConfirmationProps = (args: {
  fname: string;
}): IReturnMail => ({
  subject: 'Your password has been updated',
  templateId: undefined, //TEMPLATE ID
  html: `${JSON.stringify(args)}`,
  //dynamicTemplateData: args, //TODO: uncomment once template id is ready
});

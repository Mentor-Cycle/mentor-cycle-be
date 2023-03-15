import { IReturnMail } from '@common/types';

export const passwordResetEmailProps = (args: {
  fname: string;
  pin: string;
}): IReturnMail => ({
  subject: 'Reset your password',
  templateId: undefined, //TEMPLATE ID
  html: `${JSON.stringify(args)}`,
  // dynamicTemplateData: { //TODO: uncomment once template id is ready
  //   link: `/password-reset/`, //not being used yet. for later
  //   ...args,
  // },
});

export const updatePasswordConfirmationProps = (args: {
  fname: string;
}): IReturnMail => ({
  subject: 'Your password has been updated',
  templateId: undefined, //TEMPLATE ID
  html: `${JSON.stringify(args)}`,
  //dynamicTemplateData: args, //TODO: uncomment once template id is ready
});

import * as Mailer from './mail';

export default (emails, subject, message) => {
  const newMailer = new Mailer.default();

  newMailer.send(emails, subject, message);
};

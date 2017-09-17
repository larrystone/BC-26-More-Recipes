import nodemailer from 'nodemailer';

/**
 * Mailer class definition
 * 
 * @export
 * @class Nodemailer
 */
export default class Mailer {
  /**
   * Send mail
   * 
   * @param {object} receivers 
   * @param {string} subject Subject of the mail
   * @param {any} message 
   * @returns {object} Nodemailer instance
   * @memberof Nodemailer
   */
  send(receivers, subject, message) {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        return err.message;
      }

      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });

      const mailOptions = {
        from: '"More-Recipes 👻" <no-reply@morerecipes.com>',
        to: receivers,
        subject,
        text: `Hi, ${message}`,
        // html: '<b>Hello world?</b>'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return error.message;
        }
        // console.log('Message sent: %s', JSON.stringify(info));
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return info.messageId;
      });
    });

    return this;
  }
}

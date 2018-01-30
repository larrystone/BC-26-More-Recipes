/* eslint-disable */

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * @description - Gets mail content based on the mail type
 *
 * @param {object} mailData - mail payload
 *
 * @returns {string} content - mail content
 */
const getMailType = (mailData) => {
  switch (mailData.type) {
    case 'welcome':
      return `
      <div style="padding:20px">
    <div style="max-width:600px;margin:0 auto">
      <div style="
            background:#FAFAFA;
            font:14px sans-serif;
            color:#686f7a ;
            margin-bottom:10px">
        <div style="
              background:#256188;
              color:#ffffff;
              border-bottom:1px solid #f2f3f5 ;
              padding-bottom:20px;
              padding-top:20px">
          <h4 style="
                padding-top:0;
                padding-left:20px;
                margin:0;
                font-size:20px;
                font-family:Roboto-Regular,Helvetica,Arial,sans-serif;
                color:#ffffff;
                line-height:1.25;
                min-width:300px">
            Welcome to More-Recipes
          </h4>
        </div>
        <center>
          <img 
  src="http://res.cloudinary.com/larrystone/image/upload/v1516629887/default_food.jpg"
          width="600px" height="300px"
          />
        </center>
        <div style="padding:10px 20px;line-height:1.5em;color:#686f7a ">
          <p style="
                padding-bottom:20px;
                margin:20px 0;
                color:#686f7a ">
            Hello <strong><em>${mailData.username}</em></strong>,
          </p>
          <p style="
                padding-bottom:20px;
                margin:20px 0;
                color:#686f7a ">
            Thank you for joining our network of food enthusiasts.
            <br />
          </p>
          <p>Please click
            <strong>
              <a style="text-decoration: none" 
      href="https://more-recipe.herokuapp.com/profile/${mailData.userId}">
                here
              </a>
            </strong> to update your profile.</p>
          <p>
            <a style="text-decoration: none" 
            href="https://more-recipe.herokuapp.com">
              Or just start sharing/viewing great recipes ideas
            </a>
          </p>
        </div>
      </div>
      <div style=
      "font-family:Roboto-Regular,Helvetica,Arial,sans-serif;
      font-size:10px;
      color:#666666;
      line-height:18px;
      padding-bottom:10px">
        <div style="direction:ltr;text-align:left">© 2018 More-Recipes</div>
      </div>
    </div>
  </div>`;
    case 'review':
      return `  <div style="padding:20px">
      <div style="max-width:600px;margin:0 auto">
        <div style="
              background:#FAFAFA;
              font:14px sans-serif;
              color:#686f7a ;
              margin-bottom:10px">
              <div style="
                border-bottom:1px solid #f2f3f5 ;
                padding-bottom:20px;
                padding-top:20px">
                <h4 style="
                  padding-top:0;
                  padding-left:20px;
                  margin:0;
                  font-size:30px;
                  font-family:'Kurale', serif;">
                  More Recipes</h4>
              </div>
              <center><img src="${mailData.imageUrl}" width="100px" height="100px" style="border-radius: 50%; margin: 0 auto;"/></center>
              <div style="padding:10px 20px;line-height:1.5em;color:#686f7a ">
                <p style="
                  padding-bottom:20px;
                  margin:20px 0;
                  color:#686f7a ">
                  Hello,
                </p>
                <p style="
                  padding-bottom:20px;
                  margin:20px 0;
                  color:#686f7a ">
                  You have requested to reset your password for MoreRecipes account. Please click on this <a style="color: #ff4500" >link</a> to reset password.
                </p>
                <p style="
                  padding-bottom:15px;
                  margin-top:40px;
                  color:#686f7a ">
                  If you haven't made this request please ignore this message.
                </p>
                <p style="padding-bottom:10px;
                  margin-top:20px;
                  color:#ff4500; font-size: 20px ">
                  More-recipes&reg; <br>
                </p>
              </div>
            </div>
          </div>
      </div>`;
    case 'review':
      return `
      <table width="100%" height="100%" style="min-width:348px" border="0" cellspacing="0" cellpadding="0">
      <tbody>
        <tr height="32px"></tr>
        <tr align="center">
          <td width="32px"></td>
          <td>
            <table border="0" cellspacing="0" cellpadding="0" style="max-width:600px">
              <tbody>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tbody>
                        <tr>
                          <td align="left">
                            <img width="92" height="32" src="https://ci3.googleusercontent.com/proxy/EURRrDHt1LcCbHcRdDtMHOQPPMHe5FkDsMAHs66gxAIYzYD38Abpa1Fmy-ACuq2V1tI8GZdWA4FLsXjKM4iAD-CixwUocANswARkdK1ttXK-T1DDSfiUplKFys37dkM=s0-d-e1-ft#https://www.gstatic.com/accountalerts/email/googlelogo_color_188x64dp.png"
                              style="display:block;width:92px;height:32px" class="CToWUd">
                          </td>
                          <td align="right">
                            <img width="32" height="32" style="display:block;width:32px;height:32px" src="https://ci6.googleusercontent.com/proxy/w8ACgsIEmhjGKodu731Z-VOiYfmXsRM4zd6F_w4_cKQ1JPXF_6Y_hEPR_iJKee33yGZ8zR6o_Q08vuYMKmetfyoGNtMpt1d5CU6z3xA=s0-d-e1-ft#https://www.gstatic.com/accountalerts/email/keyhole.png"
                              class="CToWUd">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr height="16"></tr>
                <tr>
                  <td>
                    <table bgcolor="#4184F3" width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width:332px;max-width:600px;border:1px solid #f0f0f0;border-bottom:0;border-top-left-radius:3px;border-top-right-radius:3px">
                      <tbody>
                        <tr>
                          <td height="72px" colspan="3"></td>
                        </tr>
                        <tr>
                          <td width="32px"></td>
                          <td style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:24px;color:#ffffff;line-height:1.25;min-width:300px">
                            <a class="m_-141047907500446618awl" style="text-decoration:none;color:#ffffff">UpLabs</a> connected to your Google&nbsp;Account</td>
                          <td width="32px"></td>
                        </tr>
                        <tr>
                          <td height="18px" colspan="3"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table bgcolor="#FAFAFA" width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width:332px;max-width:600px;border:1px solid #f0f0f0;border-bottom:1px solid #c0c0c0;border-top:0;border-bottom-left-radius:3px;border-bottom-right-radius:3px">
                      <tbody>
                        <tr height="16px">
                          <td width="32px" rowspan="3"></td>
                          <td></td>
                          <td width="32px" rowspan="3"></td>
                        </tr>
                        <tr>
                          <td>
                            <table style="min-width:300px" border="0" cellspacing="0" cellpadding="0">
                              <tbody>
                                <tr>
                                  <td style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:13px;color:#202020;line-height:1.5;padding-bottom:4px">Hi Lawal,</td>
                                </tr>
                                <tr>
                                  <td style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:13px;color:#202020;line-height:1.5;padding:4px 0">
                                    <br>
                                    <a class="m_-141047907500446618abml" style="font-family:Roboto-Medium,Helvetica,Arial,sans-serif;font-weight:bold;text-decoration:none;color:#000000">UpLabs</a> now has access to your Google Account
                                    <a class="m_-141047907500446618abml" style="font-family:Roboto-Medium,Helvetica,Arial,sans-serif;font-weight:bold;text-decoration:none;color:#000000">larrystonegroup@gmail.com</a>.
                                    <br>
                                    <br>
                                    <a class="m_-141047907500446618abml" style="font-family:Roboto-Medium,Helvetica,Arial,sans-serif;font-weight:bold;text-decoration:none;color:#000000">UpLabs</a> can:
                                    <ul style="margin:0">
                                      <li>View your contacts</li>
                                    </ul>
                                    <br>You should only give this access to apps that you trust. Review or remove apps connected
                                    to your account any time at
                                    <a href="https://myaccount.google.com/permissions" style="text-decoration:none;color:#4285f4"
                                      target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=https://myaccount.google.com/permissions&amp;source=gmail&amp;ust=1516310011406000&amp;usg=AFQjCNH0LajTAjb771yobqpiPjqwsx6xZw">My Account</a>.
                                    <br>
                                    <br>
                                    <a href="https://support.google.com/accounts/answer/3466521" style="text-decoration:none;color:#4285f4"
                                      target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=https://support.google.com/accounts/answer/3466521&amp;source=gmail&amp;ust=1516310011406000&amp;usg=AFQjCNHSgukwAKB2LHc1O9HwpVL4d7BoOQ">Find out more</a> about what it means to connect an app to your account.</td>
                                </tr>
                                <tr>
                                  <td style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:13px;color:#202020;line-height:1.5;padding-top:28px">The Google Accounts team</td>
                                </tr>
                                <tr height="16px"></tr>
                                <tr>
                                  <td>
                                    <table style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:12px;color:#b9b9b9;line-height:1.5">
                                      <tbody>
                                        <tr>
                                          <td>This email can't receive replies. For more information, visit the
                                            <a href="https://support.google.com/accounts/answer/3466521"
                                              style="text-decoration:none;color:#4285f4" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=https://support.google.com/accounts/answer/3466521&amp;source=gmail&amp;ust=1516310011406000&amp;usg=AFQjCNHSgukwAKB2LHc1O9HwpVL4d7BoOQ">Google Accounts Help Centre</a>.</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr height="32px"></tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr height="16"></tr>
                <tr>
                  <td style="max-width:600px;font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:10px;color:#bcbcbc;line-height:1.5"></td>
                </tr>
                <tr>
                  <td>
                    <table style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:10px;color:#666666;line-height:18px;padding-bottom:10px">
                      <tbody>
                        <tr>
                          <td>You have received this mandatory email service announcement to update you about important changes to
                            your Google product or account.</td>
                        </tr>
                        <tr height="6px"></tr>
                        <tr>
                          <td>
                            <div style="direction:ltr;text-align:left">© 2018 Google Inc.,
                              <a href="https://maps.google.com/?q=1600+Amphitheatre+Parkway,+Mountain+View,+CA+94043,+USA&amp;entry=gmail&amp;source=g">1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</a>
                            </div>
                            <div style="display:none!important;max-height:0px;max-width:0px">et:127</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td width="32px"></td>
        </tr>
        <tr height="32px"></tr>
      </tbody>
    </table>`;
    default:
      return '';
  }
};

/**
 * @description - Mailer class definition
 *
 * @export
 *
 * @class Mailer
 */
export default class Mailer {
  /**
   * @description - Send mail
   *
   * @param {object} mailData - mail payload
   *
   * @returns {class} this - Mailer instance
   *
   * @memberof Mailer
   */
  send(mailData) {
    const html = getMailType(mailData);
    const mailOptions = {
      from: '"More-Recipes 👻" <stomee@gmail.com>',
      to: String(mailData.email),
      subject: `${mailData.subject}`,
      html
    };

    transporter.sendMail(mailOptions, (error, /* response */) => {
      if (error) {
        // return console.log(error);
      }
      // console.table(response);
    });

    return this;
  }
}

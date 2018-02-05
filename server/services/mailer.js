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
  src="https://res.cloudinary.com/larrystone/image/upload/v1516629887/default_food.jpg"
          width="600px" height="300px"
          />
        </center>
        <div style="padding:10px 20px;line-height:1.5em;color:#686f7a ">
          <p style="
                padding-bottom:20px;
                margin:20px 0;
                color:#686f7a ">
            Hello <strong><em>${mailData.name}</em></strong>,
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
              New Recipe Review
            </h4>
          </div>
          <center>
          <img src="${mailData.recipe.imageUrl}" width="600px" height="300px" />
          <h3 style="position: absolute; top: 345px; padding: 5px; color: white; background-color: gray;">${mailData.recipe.name}</h3>
          </center>
          <div style="padding:10px 20px;line-height:1.5em;color:#686f7a ">
            <p style="
                    margin:20px 0;
                    color:#686f7a ">
              Hello
              <strong>
                <em>${mailData.recipe.User.name}</em>
              </strong>,
            </p>
            <p style="
                    padding-bottom:20px;
                    margin:0px;
                    color:#686f7a ">
              Someone recently posted a review on one of your recipes
              <br />
            </p>
            <div style="border-left: 2px solid gray; display:flex; margin-left:10px; padding: 5px 0px 5px 10px;">
              <img src="${mailData.review.User.imageUrl}" alt="" width="50px" height="50px">
              <div style="margin-left:10px">
                <span>${mailData.review.User.name} ~ ${mailData.review.createdAt.toDateString()}</span>
                <br> ${mailData.review.content}
              </div>
            </div>
            <p>Please click
              <strong>
                <a style="text-decoration: none" href="https://more-recipe.herokuapp.com/recipes/${mailData.recipeId}">
                  here
                </a>
              </strong> to view this message in the app.</p>
          </div>
        </div>
        <div style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;
          font-size:10px;
          color:#666666;
          line-height:18px;
          padding-bottom:10px">
          <div style="direction:ltr;text-align:left">© 2018 More-Recipes</div>
        </div>
      </div>
    </div>`;
    case 'favorite':
      return `  <div style="padding:20px">
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
            Favorite Recipe Update
          </h4>
        </div>
        <center>
          <img src="${mailData.recipe.imageUrl}" width="600px" height="300px" />
          <h3 style="position: absolute; top: 345px; padding: 5px; color: white; background-color: gray;">${mailData.recipe.name}</h3>
        </center>
        <div style="padding:10px 20px;line-height:1.5em;color:#686f7a ">
          <p style="
                  margin:20px 0;
                  color:#686f7a ">
            Hello,
          </p>
          <p style="
                  padding-bottom:20px;
                  margin:0px;
                  color:#686f7a ">
              One of your favorite recipes has been recently updated.
            <br />
          </p>
          <p>Please click
            <strong>
              <a style="text-decoration: none" href="https://more-recipe.herokuapp.com/recipes/${mailData.recipe.id}">
                here
              </a>
            </strong> to find out which one.</p>
        </div>
      </div>
      <div style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;
        font-size:10px;
        color:#666666;
        line-height:18px;
        padding-bottom:10px">
        <div style="direction:ltr;text-align:left">© 2018 More-Recipes</div>
      </div>
    </div>
  </div>`;
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

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
const getMailContent = (mailData) => {
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
  src="http://res.cloudinary.com/larrystone/image/upload/v1516629887/ymoope6gkcsswmvjgbvj.jpg"
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
          <img src="${mailData.imageUrl}" width="600px" height="300px" />
          <div style="padding:10px 20px;line-height:1.5em;color:#686f7a ">
            <p style="
                  padding-bottom:5px;
                  color:#686f7a ">
              Hello <strong><em>${mailData.username}</em></strong>,
            </p>
            <p style="
                  padding-bottom:20px;
                  color:#686f7a ">
              Someone posted a review on your recipe - 
              <strong><em>${mailData.recipeName}</em></strong>
              <br />
            </p>
            <div style="margin: 5px 10px;
            border-left: 2px solid grey; 
            width: 300px; 
            display: flex; 
            padding-bottom:20px;">
              <img src="${mailData.review.User.imageUrl}"
               alt="" width="50px" height="50px">
              <div style="margin-left: 10px">
                <span>${mailData.review.User.name}  
                ~ ${new Date(mailData.review.createdAt).toLocaleDateString()}
                </span><br/>
                ${mailData.review.content}
              </div>
            </div>
            <p>click
              <strong>
                <a style="text-decoration: none"
          href="https://more-recipe.herokuapp.com/recipe/${mailData.recipeId}">
                  here
                </a>
              </strong> to view this message in the app.
            </p>
          </div>
        </div>
        <div style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;
        font-size:10px;color:#666666;line-height:18px;padding-bottom:10px">
          <div style="direction:ltr;text-align:left">© 2018 More-Recipes</div>
        </div>
      </div>
    </div>`;
    case 'recipe':
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
            Favorite Recipe Update
          </h4>
        </div>
        <img src="${mailData.imageUrl}" width="600px" height="300px" />
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
            One of your favorite recipes has been updated
            <br />
          </p>
          <p>Please click
            <strong>
              <a style="text-decoration: none" 
        href="https://more-recipe.herokuapp.com/profile/${mailData.recipeId}">
                here
              </a>
            </strong> to find out which one.
          </p>
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
    const html = getMailContent(mailData);
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

const mailer = require("@sendgrid/mail");
const key = require("../config").get("SEND_GRID_KEY");
const { get } = require("../config");
const fs = require("fs");
mailer.setApiKey(key);

let domain = get("DOMAIN");
const readFile = (template) => {
  // Function to read the template
  return new Promise((resolve, reject) =>
    fs.readFile(`${__dirname}/templates/${template}`, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  );
};

function Mail(to, subject, html, text) {
  // Constructor to create the email object
  this.to = to;
  this.from = get("EMAIL");
  this.subject = subject;
  this.html = html;
  this.text = text;
}

const welcomeTemplate = async (username) => {
  // Function to create the welcome email template and replace the username
  let template = await readFile("welcome.html");
  return await template.replaceAll("{{username}}", username);
};

const resetTemplate = async (username, id) => {
  // Function to create the reset password email template and replace the username and reset password link
  let template = await readFile("reset_password.html");
  return await template
    .replaceAll("{{username}}", username)
    .replaceAll("{{domain}}", domain)
    .replaceAll("{{reset_password_link}}", id);
};

const sendMail = async (to, subject, template) => {
  // Function to send an email
  try {
    let html = await template;
    let text = await html.replaceAll(/(<([^>]+)>)/gi, ""); // Remove the HTML tags from the email, to send it as a text
    await mailer.send(new Mail(to, subject, html, text)); // Send the email
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  welcomeTemplate,
  resetTemplate,
  sendMail,
};

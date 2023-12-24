const mailer = require("@sendgrid/mail");
const key = require("../config").get("SEND_GRID_KEY");
const fs = require("fs");
mailer.setApiKey(key);

const readFile = (template) => {
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
  this.to = to;
  this.from = "stojanov091@gmail.com";
  this.subject = subject;
  this.html = html;
  this.text = text;
}

const welcomeTemplate = async (username) => {
  let template = await readFile("welcome.html");
  return await template.replaceAll("{{username}}", username);
};

const resetTemplate = async (username, id) => {
  let template = await readFile("reset_password.html");
  return await template
    .replaceAll("{{username}}", username)
    .replaceAll("{{reset_password_link}}", id);
};

const sendMail = async (to, subject, template) => {
  try {
    let html = await template;
    let text = await html.replaceAll(/(<([^>]+)>)/gi, "");
    await mailer.send(new Mail(to, subject, html, text));
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  welcomeTemplate,
  resetTemplate,
  sendMail,
};

const nodemailer = require("nodemailer");
const mustache = require("mustache");
const fs = require("fs");
const { smtpHost, smtpPort, smtpPass, smtpUser } = require("../../config");

const sendMail = async (receiver, verificationCode) => {
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const template = fs.readFileSync(
      "app/views/mail/verification-code.html",
      "utf8"
    );

    const send = await transporter.sendMail({
      from: "LessCode <admin@lesscode.org>",
      to: receiver,
      subject: "LessCode verification code",
      html: mustache.render(template, { verificationCode: verificationCode }),
    });

    return send;
  } catch (err) {
    return err;
  }
};

module.exports = {
  sendMail,
};

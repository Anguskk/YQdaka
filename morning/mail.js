const nodemailer = require("nodemailer");

const sendMail = msg => {
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      service: "qq", // 使用了内置传输发送邮件 查看支持列表：
      port: 465, // SMTP 端口
      secureConnection: true, // 使用了 SSL
      auth: {
        user: "604202346@qq.com",
        // 这里密码不是qq密码，是你设置的smtp授权码
        pass: "uakfncivizwcbegh"
      }
    });
    let mailOptions = {
      from: "Angus<604202346@qq.com>", // 发送者
      to: "604202346@qq.com", // 接收者
      subject: "打卡提醒", // 主题
      html: msg // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });
  });
};
//sendMail(`it\'s a test ${new Date().toLocaleString()}`);
module.exports = sendMail;

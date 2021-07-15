import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const USERNAME = process.env.SMTP_USERNAME;
const PASSWORD = process.env.SMTP_PASSWORD;

const mail_transport = nodemailer.createTransport({
     host: "mail.privateemail.com",
     port: 465,
     secure: true, // upgrade later with STARTTLS
     auth: {
          user: USERNAME,
          pass: PASSWORD
     }
})


export default function SendMail(to: string, subject: string, body: string) {

     console.log(USERNAME, PASSWORD)

     mail_transport.sendMail({
          from: "Tungar-SuperApi " + USERNAME,
          to: [to],
          subject: subject,
          text: body,
          html: body
     }, (err, info) => {
          if (err) return console.log("Failed to send mail to ", to, err);

          console.log("Email Notification Sent Successfully");
     })

}
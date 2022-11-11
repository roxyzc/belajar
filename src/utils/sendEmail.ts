import nodemailer from "nodemailer";

export const sendEmail = (otp: String, user: any): any => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: ` "OTP" <${process.env.USER}>`,
    to: user.email,
    subject: "roxyzc -Verify your email",
    html: `<h1>${otp}</h1>`,
  };

  try {
    transporter.sendMail(mailOptions);
    return Promise.resolve("Berhasil mengirim ke email");
  } catch (error: any) {
    return Promise.reject(error.message);
  }
};

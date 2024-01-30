import nodemailer from 'nodemailer';

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const result = await transporter.sendMail({
            from: 'StudyNotion || codingCourse - by Kartik',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });


        console.log("result -> ", result);
        return result;
    } catch (error) {
        console.log("error -> ", error);
        return error;
    }
}

export default mailSender;
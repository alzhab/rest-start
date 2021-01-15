import config from './config';
import transporter from '../nodemailer/transporter';

export default ({
	to,
	subject,
	text,}) => {
	const mailData = {
		from: config.email.auth.user,  // sender address
		to,   // list of receivers
		subject,
		text,
	};

	return transporter.sendMail(mailData)
};

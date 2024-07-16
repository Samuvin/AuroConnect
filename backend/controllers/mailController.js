import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

async function sendMail(req, res) {
	try {
		const startDate = new Date(req.body.start);
		console.log("Start Date:", req.body.start, startDate.getTime(), startDate);
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: process.env.EMAIL_USER, // Gmail user from environment variable
				pass: process.env.EMAIL_PASS, // Gmail password from environment variable
			},
		});

		// Function to send the email
		const sendReminderEmail = async () => {
			try {
				// Send mail with defined transport object
				let info = await transporter.sendMail({
					from: `"Contest Reminder" <${process.env.EMAIL_USER}>`, // sender address
					to: req.body.email, // list of receivers
					subject: `Reminder: ${req.body.event} Contest`, // Subject line
					html: `
		<div style="font-family: Arial, sans-serif; line-height: 1.6;">
			<h1 style="color: #4CAF50; margin-bottom: 20px;">${req.body.event}</h1>
			<p style="margin-bottom: 10px;"><strong>Start Date:</strong> ${startDate.toUTCString()}</p>
			<p style="margin-bottom: 10px;"><strong>Duration:</strong> ${
				req.body.duration
			}</p>
			<p style="margin-bottom: 10px;"><strong>Link:</strong> <a href="${
				req.body.href
			}" style="color: #1E90FF; text-decoration: none;">Contest Link</a></p>
			<p style="margin-bottom: 10px; color: #FF6347;">This is a reminder that the contest will start in 1 hour.</p>
		</div>
	`,
				});
				res.status(200).json({
					status: "Success",
					message: `Remainder email for ${req.body.event} `,
				});
			} catch (error) {
				console.error("Error sending reminder email:", error);
				res.status(200).json({
					status: "Failed",
					message: error,
				});
			}
		};
		// Calculate the reminder time (1 hour before start)
		const reminderTime = new Date(startDate.getTime() - 60 * 60 * 1000);
		console.log(`Reminder time: ${reminderTime}`);

		// Convert reminder time to cron format
		const cronTime = `${reminderTime.getUTCMinutes()} ${reminderTime.getUTCHours()} ${reminderTime.getUTCDate()} ${
			reminderTime.getUTCMonth() + 1
		} *`;

		// Schedule the task using node-cron
		cron.schedule(cronTime, sendReminderEmail);

		console.log();
		res.status(200).json({
			status: "success",
			message: `Scheduled reminder email for ${
				req.body.event
			} at ${reminderTime.toUTCString()}`,
		});
	} catch (error) {
		console.error("Error scheduling email:", error);
		res.status(400).json({ status: "failed", message: error.message });
	}
}

export default sendMail;

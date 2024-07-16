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
					from: process.env.EMAIL_USER, // sender address
					to: "samuvin.j@example.com", // list of receivers
					subject: `Reminder: ${req.body.name} Contest`, // Subject line
					html: `
                        <h1>${req.body.event}</h1>
                        <p>Start Date: ${startDate.toUTCString()}</p>
                        <p>Duration: ${req.body.duration}</p>
                        <p>Link: ${req.body.href}</p>
                        <p>This is a reminder that the contest will start in 1 hour.</p>
                    `,
				});
				console.log("Reminder email sent: %s", info.messageId); // Message ID
				res.status(200).json({
					status: "Success",
					message: `Reminder email sent: %s, ${info.messageId}`,
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
		res
			.status(200)
			.json({
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

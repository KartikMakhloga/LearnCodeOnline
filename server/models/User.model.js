import mongoose from 'mongoose';
import userSuccess from '../mail/templates/userSuccess.js';
import mailSender from '../utils/mailSender.js';

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
	{
		// Define the name field with type String, required, and trimmed
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		// Define the email field with type String, required, and trimmed
		email: {
			type: String,
			required: true,
			trim: true,
		},

		// Define the password field with type String and required
		password: {
			type: String,
			required: true,
		},
		// Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
		accountType: {
			type: String,
			enum: ["Admin", "Student", "Instructor"],
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
		approved: {
			type: Boolean,
			default: true,
		},
		additionalDetails: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Profile",
		},
		courses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Course",
			},
		],
		token: {
			type: String,
		},
		resetPasswordExpires: {
			type: Date,
		},
		image: {
			type: String,
		},
		courseProgress: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "courseProgress",
			},
		],

		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

async function sendVerificationEmail(email, name) {

	try {
		const mailResponse = await mailSender(
			email,
			'Account Created Successfully',
			userSuccess(name)
		);
		console.log('Email sent successfully: ', mailResponse.response);
	} catch (error) {
		console.log('Error occurred while sending email: ', error);
		throw error;
	}
	
}

// Define the post-save hook for the user
userSchema.post('save', async function () {
	// If the user is a student, send a welcome email
    if(this.accountType === 'Student') {
		await sendVerificationEmail(this.email, this.firstName);
	}
});
const User = mongoose.model('User', userSchema);
export default User;
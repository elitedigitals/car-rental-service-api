const userRegistrationTemplate = (userName, verificationLink) => `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #3498db;">Welcome to Our Car Rental Service</h2>
            <p>Dear ${userName},</p>
            <p>Thank you for registering with us. Please verify your email address by clicking the link below:</p>
            <p><a href="${verificationLink}" style="color: #3498db; text-decoration: none;">Verify Email</a></p>
            <p>If you did not register for our service, please ignore this email.</p>
            <p>Best regards,</p>
            <p><strong>Your Car Rental Team</strong></p>
        </body>
    </html>
`;

export default userRegistrationTemplate;

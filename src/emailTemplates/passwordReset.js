const passwordResetTemplate = (userName, resetLink) => `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #e67e22;">Password Reset Request</h2>
            <p>Dear ${userName},</p>
            <p>We received a request to reset your password. You can reset your password by clicking the link below:</p>
            <p><a href="${resetLink}" style="color: #e67e22; text-decoration: none;">Reset Password</a></p>
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>Best regards,</p>
            <p><strong>Your Car Rental Team</strong></p>
        </body>
    </html>
`;

export default passwordResetTemplate;

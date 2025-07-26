const generalNotificationTemplate = (userName, subject, message) => `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #34495e;">${subject}</h2>
            <p>Dear ${userName},</p>
            <p>${message}</p>
            <p>Best regards,</p>
            <p><strong>Your Car Rental Team</strong></p>
        </body>
    </html>
`;

export default generalNotificationTemplate;

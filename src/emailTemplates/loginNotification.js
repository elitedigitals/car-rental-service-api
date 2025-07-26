const loginNotificationTemplate = (userName, loginTime, ipAddress) => `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2ecc71;">Login Notification</h2>
            <p>Dear ${userName},</p>
            <p>We noticed a login to your account at the following time:</p>
            <ul>
                <li><strong>Login Time:</strong> ${loginTime}</li>
                <li><strong>IP Address:</strong> ${ipAddress}</li>
            </ul>
            <p>If this was you, no further action is required. If you suspect unauthorized access, please reset your password immediately.</p>
            <p>Best regards,</p>
            <p><strong>Your Car Rental Team</strong></p>
        </body>
    </html>
`;

export default loginNotificationTemplate;
